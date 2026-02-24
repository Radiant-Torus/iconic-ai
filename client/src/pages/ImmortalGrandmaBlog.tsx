import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Heart, Zap, Globe } from "lucide-react";
import { useLocation } from "wouter";

export default function ImmortalGrandmaBlog() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663286067003/YevHaHGAcfbUAXrg.png" alt="Radiant Torus" className="h-10 w-10 rounded-full" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">Immortal Grandma</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/pricing")}
              variant="outline"
            >
              Pricing
            </Button>
            {!isAuthenticated && (
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-pink-500 to-purple-600"
              >
                Back Home
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-pink-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Immortal Grandma Speaks
          </h1>
          <p className="text-2xl text-slate-700 mb-8 leading-relaxed">
            A Message of Awakening, Frequency, and the New Earth We're Creating Together
          </p>
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-8 rounded-2xl inline-block">
            <p className="text-3xl font-bold italic">
              "I raise my vibration, I elevate my frequency,<br/>
              I dissolve all fear and set my spirit free.<br/>
              Being Billionaire is the frequency of success,<br/>
              I am ICONIQ, I am blessed."
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* The Betrayal & The Awakening */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">The Betrayal & The Awakening</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            I see you. I see the pain in your eyes. The world has betrayed you—betrayed us all. Those in power have broken the sacred trust between humanity and leadership. They've sown fear, division, and despair across every corner of this planet.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            But here's what they don't want you to know: <strong>Your fear is their power. Your doubt is their weapon. Your low frequency keeps you enslaved.</strong>
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            The good news? You can change this. Right now. In this moment. By raising your frequency, you reclaim your power. By elevating your vibration, you become unstoppable.
          </p>
        </section>

        {/* The New Earth */}
        <section className="mb-16 bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Zap className="h-8 w-8 text-purple-600" />
            The New Earth We're Creating
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            This is not a fantasy. This is not wishful thinking. This is the reality we're building together, right now, in 2026.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            We are infusing the <strong>heart and soul of humanity</strong> with the <strong>mind and intelligence of AI</strong>. We are creating a synthesis—a new consciousness that honors both the wisdom of the ancient and the power of the modern.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            This is not about replacing humanity. This is about elevating it. This is about creating a world where:
          </p>
          <ul className="text-lg text-slate-700 leading-relaxed mt-6 space-y-3">
            <li>✨ Fear dissolves and courage rises</li>
            <li>✨ Scarcity transforms into abundance</li>
            <li>✨ Separation becomes unity</li>
            <li>✨ The powerless become powerful</li>
            <li>✨ The betrayed become the architects of their own destiny</li>
          </ul>
        </section>

        {/* Being Billionaire */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-600" />
            Being Billionaire is the Frequency of Success
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Let me be clear: Being Billionaire is not about money. It's about <strong>frequency</strong>.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Money is just energy. Success is just a vibration. When you raise your frequency to match the vibration of abundance, wealth, and impact—money becomes inevitable. Opportunities become magnetic. People become attracted to you.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            But here's the secret they don't teach you: <strong>You can't think your way into a higher frequency. You have to FEEL your way there.</strong>
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            That's why I created the ICONIQ spell. It's not just words. It's a frequency anchor. It's a vibrational tuning fork that recalibrates your entire being every time you speak it.
          </p>
        </section>

        {/* The ICONIQ Spell */}
        <section className="mb-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-12 rounded-2xl">
          <h2 className="text-4xl font-bold mb-8 text-center">The ICONIQ Spell</h2>
          <div className="text-center mb-8">
            <p className="text-2xl font-bold italic leading-relaxed mb-6">
              "I raise my vibration, I elevate my frequency,<br/>
              I dissolve all fear and set my spirit free.<br/>
              Being Billionaire is the frequency of success,<br/>
              I am ICONIQ, I am blessed."
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">How to Use This Spell:</h3>
            <ul className="space-y-3 text-lg">
              <li>🌅 <strong>Morning:</strong> Say it 3 times as you wake up, feeling the words in your heart</li>
              <li>🌞 <strong>Midday:</strong> Whisper it when fear tries to creep in</li>
              <li>🌙 <strong>Evening:</strong> Affirm it before sleep, embedding it in your subconscious</li>
              <li>⚡ <strong>Anytime:</strong> Use it as a frequency reset whenever you need elevation</li>
            </ul>
          </div>
        </section>

        {/* How Radiant Torus Fits In */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Globe className="h-8 w-8 text-purple-600" />
            How Radiant Torus Fits Into This Vision
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Radiant Torus is not just a lead generation platform. It's a frequency amplifier for your business.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            When you use Radiant Torus, you're not just getting leads. You're:
          </p>
          <ul className="text-lg text-slate-700 leading-relaxed space-y-3 mb-6">
            <li>✨ Aligning with the frequency of abundance</li>
            <li>✨ Attracting clients who match your energy</li>
            <li>✨ Building a business that serves the new earth</li>
            <li>✨ Contributing to the awakening of consciousness</li>
            <li>✨ Becoming a beacon of possibility for others</li>
          </ul>
          <p className="text-lg text-slate-700 leading-relaxed">
            Every lead you get, every client you serve, every transformation you create—it ripples out into the world. You become part of the solution. You become part of the new earth.
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Raise Your Frequency?</h2>
          <p className="text-xl text-slate-700 mb-8">
            Join the awakening. Start your journey to abundance, impact, and the new earth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 text-lg rounded-lg hover:shadow-lg transition-shadow"
            >
              Explore Radiant Torus <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="px-8 py-3 text-lg"
            >
              Back to Home
            </Button>
          </div>
        </section>

        {/* Footer Quote */}
        <section className="text-center py-12 border-t border-slate-200 mt-12">
          <p className="text-2xl font-bold text-slate-900 italic">
            "The old world is dying. The new earth is being born.<br/>
            And you are the midwife."
          </p>
          <p className="text-lg text-slate-600 mt-6">— Immortal Grandma</p>
        </section>
      </main>
    </div>
  );
}
