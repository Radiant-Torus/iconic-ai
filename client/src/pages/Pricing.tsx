import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, Check, Zap, MapPin, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeService, setActiveService] = useState<"leads" | "audit" | "meta_audit">("leads");

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
        metaAuditService: service === "meta" ? (tier as any) : undefined,
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating checkout session:", error);
    }
  };

  const getServiceTiers = (service: string) => {
    return tiers.filter((t) => t.service === service);
  };

  const isCurrentTier = (tierId: string, service: string) => {
    return subscription?.tier === tierId.split("-")[1];
  };

  const renderServiceSection = (service: "leads" | "audit" | "meta_audit") => {
    const serviceTiers = getServiceTiers(service);
    
    const serviceInfo: Record<string, any> = {
      leads: {
        title: "Lead Generation",
        description: "AI-powered lead generation for your business",
        icon: Zap,
        color: "from-yellow-400 to-orange-500",
        highlight: "starter",
      },
      audit: {
        title: "Google Maps Audit",
        description: "Optimize your Google Business Profile ranking",
        icon: MapPin,
        color: "from-blue-400 to-cyan-500",
        highlight: "professional",
      },
      meta_audit: {
        title: "Meta Ads Audit",
        description: "AI-powered Meta ads optimization and analysis",
        icon: TrendingUp,
        color: "from-pink-400 to-purple-500",
        highlight: "professional",
      },
    };

    const info = serviceInfo[service];
    const IconComponent = info.icon;

    return (
      <div className="space-y-8">
        {/* Service Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <IconComponent className="h-8 w-8 text-slate-900" />
            <h3 className="text-3xl font-bold text-slate-900">{info.title}</h3>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{info.description}</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`border-2 transition-all ${
                tier.tier === info.highlight
                  ? `border-gradient-to-r ${info.color} shadow-2xl scale-105`
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <CardHeader>
                {tier.tier === info.highlight && (
                  <Badge className={`w-fit mb-2 bg-gradient-to-r ${info.color} text-white`}>
                    Most Popular
                  </Badge>
                )}
                <CardTitle className="text-2xl capitalize">{tier.tier.replace(/_/g, " ")}</CardTitle>
                <CardDescription>{(tier as any).description || "Premium service tier"}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <div className="text-4xl font-bold text-slate-900">
                    ${(tier.price / 100).toFixed(0)}
                  </div>
                  <p className="text-sm mt-1 text-slate-600">per month, billed monthly</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {tier.features.map((feature: string) => (
                    <div key={feature as string} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{feature as string}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectTier(tier.id)}
                  disabled={isLoading && selectedTier === tier.id}
                  className={`w-full py-6 text-base font-semibold ${
                    tier.tier === info.highlight
                      ? `bg-gradient-to-r ${info.color} hover:opacity-90 text-white`
                      : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                  }`}
                >
                  {isLoading && selectedTier === tier.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentTier(tier.id, service) ? (
                    "Current Plan"
                  ) : (
                    "Get Started"
                  )}
                </Button>

                {isCurrentTier(tier.id, service) && (
                  <div className="text-center text-sm text-green-600 font-semibold">
                    ✓ Active Subscription
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen radiant-background">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663286067003/YevHaHGAcfbUAXrg.png"
              alt="Radiant Torus"
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">
              Radiant Torus
            </h1>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Complete Business Growth Platform
          </h2>
           <p className="text-2xl font-bold text-slate-800 max-w-2xl mx-auto">
            Choose the services that work best for your business. All powered by AI and designed for HVAC contractors and local service businesses.
          </p>
        </div>

        {/* Service Tabs */}
        <Tabs
          value={activeService}
          onValueChange={(value) => setActiveService(value as "leads" | "audit" | "meta_audit")}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="leads" className="text-base">
              <Zap className="h-4 w-4 mr-2" />
              Lead Gen
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-base">
              <MapPin className="h-4 w-4 mr-2" />
              Maps Audit
            </TabsTrigger>
            <TabsTrigger value="meta_audit" className="text-base">
              <TrendingUp className="h-4 w-4 mr-2" />
              Meta Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-8">
            {renderServiceSection("leads")}
          </TabsContent>

          <TabsContent value="audit" className="space-y-8">
            {renderServiceSection("audit")}
          </TabsContent>

          <TabsContent value="meta_audit" className="space-y-8">
            {renderServiceSection("meta_audit")}
          </TabsContent>
        </Tabs>

        {/* Bundle Offer */}
        <div className="mt-16 bg-gradient-to-r from-yellow-50 to-purple-50 rounded-xl p-8 border-2 border-yellow-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">🎁 Bundle & Save</h3>
            <p className="text-slate-600 mb-4">
              Combine multiple services for maximum impact. Contact us for custom bundle pricing.
            </p>
            <Button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/");
                  return;
                }
                toast.info("Bundle pricing available - contact support for details");
              }}
              className="bg-gradient-to-r from-yellow-400 to-purple-500 text-white hover:opacity-90"
            >
              Learn About Bundles
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Can I use multiple services?
              </h4>
              <p className="text-slate-600">
                Absolutely! Many customers combine lead generation with audits for maximum results. Contact us for bundle pricing.
              </p>
            </div>

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
                Contact our sales team for a free trial or demo of any service.
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

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                How quickly will I see results?
              </h4>
              <p className="text-slate-600">
                Lead generation starts within 24 hours. Audits are completed within 3-5 business days.
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
