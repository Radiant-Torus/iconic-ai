import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Check, Zap, TrendingUp, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function MetaAuditPage() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get pricing tiers for meta_audit service
  const { data: tiers = [] } = trpc.payment.getPricingTiers.useQuery();
  const metaAuditTiers = tiers.filter((t) => t.service === "meta_audit");

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
        metaAuditService: service === "meta-audit" ? (tier as any) : undefined,
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating checkout session:", error);
    }
  };

  const getTierDescription = (tier: string) => {
    const descriptions: Record<string, string> = {
      starter: "Perfect for getting started with Meta ads optimization",
      professional: "Comprehensive analysis with actionable recommendations",
      done_for_you: "Full implementation and ongoing optimization",
    };
    return descriptions[tier] || "";
  };

  const getTierFeatures = (tier: string) => {
    const features: Record<string, string[]> = {
      starter: [
        "Campaign performance analysis",
        "Audience targeting review",
        "Creative performance breakdown",
        "Basic recommendations",
      ],
      professional: [
        "Deep campaign analysis",
        "Audience optimization strategy",
        "Creative testing recommendations",
        "Budget reallocation plan",
        "30-min strategy call",
        "ROI improvement projections",
      ],
      done_for_you: [
        "Everything in Professional",
        "Full implementation of recommendations",
        "Campaign optimization",
        "Monthly performance reports",
        "Ongoing optimization",
        "Dedicated account support",
      ],
    };
    return features[tier] || [];
  };

  const isCurrentTier = (tierId: string) => {
    return subscription?.tier === tierId;
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
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            NEW SERVICE
          </Badge>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Meta Ads Optimization Audit
          </h2>
          <p className="text-xl subtitle max-w-2xl mx-auto">
            Unlock the full potential of your Meta advertising campaigns with AI-powered analysis and expert recommendations.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-lg">Deep Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                AI-powered analysis of your campaigns, audiences, and creative performance across all Meta platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <CardTitle className="text-lg">Actionable Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Get specific, prioritized recommendations to improve ROAS, reduce CPC, and scale your campaigns profitably.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-6 w-6 text-yellow-600" />
                <CardTitle className="text-lg">Fast Results</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Get results in days, not weeks. Implement recommendations immediately to see impact on your bottom line.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {metaAuditTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`border-2 transition-all ${
                tier.tier === "professional"
                  ? "border-gradient-to-r from-pink-500 to-purple-600 shadow-2xl scale-105"
                  : "border-slate-200 hover:border-blue-600"
              }`}
            >
              <CardHeader>
                {tier.tier === "professional" && (
                  <Badge className="w-fit mb-2 bg-gradient-to-r from-pink-500 to-purple-600">
                    Most Popular
                  </Badge>
                )}
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{getTierDescription(tier.tier)}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <div className="text-4xl font-bold text-slate-900">
                    ${(tier.price / 100).toFixed(0)}
                  </div>
                  <p className="text-sm mt-1 subtitle-alt">per month, billed monthly</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {getTierFeatures(tier.tier).map((feature: string) => (
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
                    tier.tier === "professional"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                  }`}
                >
                  {isLoading && selectedTier === tier.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentTier(tier.tier) ? (
                    "Current Plan"
                  ) : (
                    "Get Started"
                  )}
                </Button>

                {isCurrentTier(tier.tier) && (
                  <div className="text-center text-sm text-green-600 font-semibold">
                    ✓ Active Subscription
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            What's Included in Your Audit
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Campaign Performance Analysis
              </h4>
              <p className="text-slate-600 ml-7">
                Deep dive into your active campaigns, including spend, reach, impressions, and conversion metrics.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Audience Segmentation Review
              </h4>
              <p className="text-slate-600 ml-7">
                Identify underperforming audiences and opportunities for better targeting and segmentation.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Creative Performance Breakdown
              </h4>
              <p className="text-slate-600 ml-7">
                See which ads are driving results and which ones are dragging down your overall performance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Budget Optimization Recommendations
              </h4>
              <p className="text-slate-600 ml-7">
                Get specific recommendations on how to reallocate your budget for maximum ROI.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Detailed Audit Report
              </h4>
              <p className="text-slate-600 ml-7">
                Professional PDF report with findings, recommendations, and implementation roadmap.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Expert Strategy Call
              </h4>
              <p className="text-slate-600 ml-7">
                30-minute call with our team to discuss findings and answer your questions (Professional & Done-For-You).
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                How long does the audit take?
              </h4>
              <p className="text-slate-600">
                Most audits are completed within 3-5 business days. You'll receive your detailed report via email.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Do I need to share my account access?
              </h4>
              <p className="text-slate-600">
                For Starter tier, you provide screenshots. For Professional & Done-For-You, we request read-only access to your Ads Manager.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                What if I'm running multiple ad accounts?
              </h4>
              <p className="text-slate-600">
                We can audit multiple accounts. Professional & Done-For-You tiers include up to 3 accounts per month.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Can I upgrade or downgrade anytime?
              </h4>
              <p className="text-slate-600">
                Yes! Changes take effect on your next billing cycle. No questions asked.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                What if I'm not satisfied?
              </h4>
              <p className="text-slate-600">
                We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your subscription.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Do you implement the recommendations?
              </h4>
              <p className="text-slate-600">
                Starter: Recommendations only. Professional: Recommendations + strategy call. Done-For-You: Full implementation included.
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
