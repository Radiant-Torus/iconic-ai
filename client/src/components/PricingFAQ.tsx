import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes! You can cancel your subscription anytime with no penalties. We believe in earning your business every month. If you're not satisfied, just let us know.",
  },
  {
    id: 2,
    question: "How quickly will I see results?",
    answer:
      "Most clients see their first leads within 48 hours of signing up. For Google Maps audits, you'll see recommendations immediately. Meta ads audits typically show ROI improvements within 2-4 weeks of implementation.",
  },
  {
    id: 3,
    question: "What if I want to upgrade or downgrade my plan?",
    answer:
      "You can change your plan anytime. Upgrades take effect immediately, and downgrades apply at your next billing cycle. We'll prorate any differences.",
  },
  {
    id: 4,
    question: "Do you offer refunds?",
    answer:
      "We stand behind our service. If you're not satisfied in the first 30 days, we'll refund 100% of your payment. After 30 days, we offer a 14-day money-back guarantee on new services.",
  },
  {
    id: 5,
    question: "Can I combine multiple services?",
    answer:
      "Absolutely! Many of our best customers use all three services together. We offer bundle discounts when you combine Lead Generation + Google Maps Audit + Meta Ads Audit.",
  },
  {
    id: 6,
    question: "Is there a setup fee or contract?",
    answer:
      "No setup fees, no contracts, no hidden charges. You pay only for the service tier you choose, billed monthly. Cancel anytime.",
  },
];

export default function PricingFAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to know about our services
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="font-semibold text-slate-900 text-left">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-600 flex-shrink-0 ml-4 transition-transform ${
                    openId === item.id ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {openId === item.id && (
                <div className="px-6 py-4 bg-white border-t border-slate-200">
                  <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <a
            href="mailto:support@radianttorus.com"
            className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </section>
  );
}
