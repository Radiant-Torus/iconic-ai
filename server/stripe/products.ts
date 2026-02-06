/**
 * Stripe Products Configuration
 * Define all pricing tiers and their corresponding Stripe product/price IDs
 */

export const STRIPE_PRODUCTS = {
  BASIC: {
    name: "Basic",
    price: 11100, // $111.00 in cents
    currency: "usd",
    interval: "month",
    description: "Basic lead generation tier",
    features: ["Daily leads", "Basic dashboard", "Email support"],
  },
  AGENCY_PARTNER: {
    name: "Agency Partner",
    price: 22200, // $222.00 in cents
    currency: "usd",
    interval: "month",
    description: "White-label + daily leads for agencies",
    features: [
      "Daily qualified leads",
      "White-label option",
      "Advanced dashboard",
      "Priority support",
      "Lead export",
    ],
  },
  ELITE: {
    name: "Elite",
    price: 33300, // $333.00 in cents
    currency: "usd",
    interval: "month",
    description: "Premium features and dedicated support",
    features: [
      "Unlimited daily leads",
      "White-label + API access",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 priority support",
    ],
  },
};

/**
 * Get product by tier name
 */
export function getProductByTier(tier: string) {
  const tierKey = tier.toUpperCase().replace(/-/g, "_");
  return (STRIPE_PRODUCTS as Record<string, any>)[tierKey] || null;
}

/**
 * Get all available tiers
 */
export function getAvailableTiers() {
  return Object.keys(STRIPE_PRODUCTS).map((key) => ({
    id: key.toLowerCase().replace(/_/g, "-"),
    name: (STRIPE_PRODUCTS as Record<string, any>)[key].name,
    price: (STRIPE_PRODUCTS as Record<string, any>)[key].price,
    description: (STRIPE_PRODUCTS as Record<string, any>)[key].description,
  }));
}
