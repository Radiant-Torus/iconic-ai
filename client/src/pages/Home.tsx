import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap, TrendingUp, Users } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen radiant-background">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663286067003/YevHaHGAcfbUAXrg.png" alt="Radiant Torus" className="h-10 w-10 rounded-full" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">Radiant Torus</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-600">Welcome, {user?.name || "Partner"}!</span>
                <Button
                  onClick={() => navigate("/leads")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Leads
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/pricing")}
                  variant="outline"
                >
                  Pricing
                </Button>
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated ? (
          // Authenticated view
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Your AI-Powered Lead Generator
              </h2>
              <p className="text-2xl font-bold text-slate-800 max-w-2xl mx-auto">
                Get qualified leads delivered daily, tailored to your niche. No complicated setup. Just results.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm subtitle-alt">Daily Leads</p>
                      <p className="text-2xl font-bold text-slate-900">Automatic</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm subtitle-alt">Qualified</p>
                      <p className="text-2xl font-bold text-slate-900">High Quality</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm subtitle-alt">Your Niche</p>
                      <p className="text-2xl font-bold text-slate-900">Perfect Fit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6">
                Click the button below to select your niche and generate your first batch of leads.
              </p>
              <Button
                onClick={() => navigate("/leads")}
                className="bg-white text-blue-600 hover:bg-slate-100 font-semibold px-8 py-6 text-lg"
              >
                Generate Leads Now
              </Button>
            </div>
          </div>
        ) : (
          // Unauthenticated view
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-slate-900 mb-4">
                Get Qualified Leads Daily
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                AI-powered lead generation for any business niche. Simple. Automatic. Effective.
              </p>
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-lg"
              >
                Sign In to Get Started
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Automatic Daily Delivery</CardTitle>
                  <CardDescription>
                    Get fresh, qualified leads delivered every morning at 6 AM
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Highly Qualified</CardTitle>
                  <CardDescription>
                    Each lead is scored and verified for conversion potential
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Any Niche Works</CardTitle>
                  <CardDescription>
                    From wellness to real estate, our AI adapts to your industry
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* How It Works */}
            <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                How It Works (3 Simple Steps)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                    1
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Tell Us Your Niche</h4>
                  <p className="text-slate-600">
                    Select your industry or business type. That's it!
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                    2
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">AI Finds Your Leads</h4>
                  <p className="text-slate-600">
                    Our AI searches the best sources for your industry
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                    3
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Get Qualified Leads</h4>
                  <p className="text-slate-600">
                    Receive verified, ready-to-contact business prospects
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Teaser */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                Simple Pricing. No Surprises.
              </h3>
              <p className="text-slate-600 mb-8">
                Choose the plan that works best for your business. All plans include daily AI-powered lead generation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-2 border-slate-200 hover:border-blue-600 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-3xl text-blue-600">$111</CardTitle>
                    <CardDescription>Basic</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">Perfect for getting started</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-600 shadow-lg">
                  <CardHeader>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold w-fit mb-2">
                      Most Popular
                    </div>
                    <CardTitle className="text-3xl text-blue-600">$222</CardTitle>
                    <CardDescription>Agency Partner</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">White-label + daily leads</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-slate-200 hover:border-blue-600 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-3xl text-blue-600">$333</CardTitle>
                    <CardDescription>Elite</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">Premium features & support</p>
                  </CardContent>
                </Card>
              </div>
              <Button
                onClick={() => navigate("/pricing")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-lg"
              >
                View Full Pricing
              </Button>
            </div>

            {/* Final CTA */}
            <div className="mt-16 text-center">
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-lg"
              >
                Get Started Now
              </Button>
              <p className="text-slate-600 mt-4">No credit card required. Start generating leads today.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center gap-6 mb-6 text-sm flex-wrap">
            <button onClick={() => navigate("/immortal-grandma")} className="text-purple-600 hover:text-purple-700 underline font-semibold">
              Immortal Grandma
            </button>
            <button onClick={() => navigate("/terms")} className="text-blue-600 hover:text-blue-700 underline">
              Terms of Service
            </button>
            <button onClick={() => navigate("/privacy")} className="text-blue-600 hover:text-blue-700 underline">
              Privacy Policy
            </button>
          </div>
          <p className="text-center text-slate-600">&copy; 2026 Radiant Torus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
