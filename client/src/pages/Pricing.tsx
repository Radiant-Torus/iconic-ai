import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Check } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get pricing tiers
  const { data: tiers = [] } = trpc.payment.getPricingTiers.useQuery();

  // Get current subscription status
  const { data: subscription } = trpc.payment.getSubscriptionStatus.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Create checkout session mutation
  const createCheckoutMutation = trpc.payment.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.url) {
        toast.success("Redirecting to checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message || "Failed to create checkout session");
    },
  });

  const handleSelectTier = async (tierId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to subscribe");
      navigate("/");
      return;
    }

    setSelectedTier(tierId);
    setIsLoading(true);

    try {
      const [service, tier] = tierId.split("-");
      await createCheckoutMutation.mutateAsync({
        leadsService: service === "leads" ? (tier as any) : undefined,
        auditService: service === "audit" ? (tier as any) : undefined,
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating checkout session:", error);
    }
  };

  const getTierDescription = (tierId: string) => {
    const descriptions: Record<string, string> = {
      basic: "Perfect for getting started with lead generation",
      agency_partner:
        "White-label option + daily leads for agencies and resellers",
      elite: "Premium features, unlimited leads, and dedicated support",
    };
    return descriptions[tierId] || "";
  };

  const getTierFeatures = (tierId: string) => {
    const features: Record<string, string[]> = {
      basic: [
        "Daily lead generation",
        "Basic dashboard",
        "Email support",
        "Up to 5 niches",
        "Lead export (CSV)",
      ],
      agency_partner: [
        "Daily qualified leads",
        "White-label option",
        "Advanced dashboard",
        "Priority support",
        "Lead export (CSV, PDF)",
        "Custom branding",
        "Unlimited niches",
      ],
      elite: [
        "Unlimited daily leads",
        "White-label + API access",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support",
        "Advanced analytics",
        "Custom lead criteria",
      ],
    };
    return features[tierId] || [];
  };

  const isCurrentTier = (tierId: string) => {
    const tierMap: Record<string, string> = {
      basic: "basic",
      agency_partner: "agency_partner",
      elite: "elite",
    };
    return subscription?.tier === tierMap[tierId];
  };

  return (
    <div className="min-h-screen radiant-background">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663286067003/YevHaHGAcfbUAXrg.png" alt="Radiant Torus" className="h-10 w-10 rounded-full" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">Radiant Torus</h1>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl subtitle max-w-2xl mx-auto">
            Choose the plan that works best for your business. All plans include daily AI-powered lead generation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`border-2 transition-all ${
                tier.id === "agency_partner"
                  ? "border-blue-600 shadow-2xl scale-105"
                  : "border-slate-200 hover:border-blue-600"
              }`}
            >
              <CardHeader>
                {tier.id === "agency_partner" && (
                  <Badge className="w-fit mb-2 bg-blue-600">Most Popular</Badge>
                )}
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{getTierDescription(tier.id)}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <div className="text-4xl font-bold text-slate-900">
                    {tier.priceUSD}
                  </div>
                  <p className="text-sm mt-1 subtitle-alt">per month, billed monthly</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {getTierFeatures(tier.id).map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectTier(tier.id)}
                  disabled={isLoading && selectedTier === tier.id}
                  className={`w-full py-6 text-base font-semibold ${
                    tier.id === "agency_partner"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                  }`}
                >
                  {isLoading && selectedTier === tier.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentTier(tier.id) ? (
                    "Current Plan"
                  ) : (
                    "Get Started"
                  )}
                </Button>

                {isCurrentTier(tier.id) && (
                  <div className="text-center text-sm text-green-600 font-semibold">
                    ✓ Active Subscription
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Can I change my plan anytime?
              </h4>
              <p className="text-slate-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-slate-600">
                We accept all major credit cards (Visa, Mastercard, American Express) through Stripe.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Is there a free trial?
              </h4>
              <p className="text-slate-600">
                Contact our sales team for a free trial or demo of the platform.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                What if I'm not satisfied?
              </h4>
              <p className="text-slate-600">
                We offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>

        {/* Test Card Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Testing:</strong> Use card number <code>4242 4242 4242 4242</code> with any future expiration date and any 3-digit CVC to test payments.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
