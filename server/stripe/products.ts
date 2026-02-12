/**
 * Stripe Products Configuration
 * Define all pricing tiers for lead generation and audit services
 */

export const STRIPE_PRODUCTS = {
  // LEAD GENERATION SERVICE
  LEADS_BASIC: {
    name: "Leads - Starter",
    price: 11100, // $111.00 in cents
    currency: "usd",
    interval: "month",
    description: "Basic lead generation - 5 leads/day",
    service: "leads",
    tier: "basic",
    features: ["5 leads per day", "Basic dashboard", "Email support", "CSV export"],
  },
  LEADS_PROFESSIONAL: {
    name: "Leads - Professional",
    price: 22200, // $222.00 in cents
    currency: "usd",
    interval: "month",
    description: "Professional lead generation - 20 leads/day",
    service: "leads",
    tier: "professional",
    features: [
      "20 leads per day",
      "Advanced dashboard",
      "Priority support",
      "CSV + PDF export",
      "Lead filtering",
    ],
  },
  LEADS_ENTERPRISE: {
    name: "Leads - Enterprise",
    price: 33300, // $333.00 in cents
    currency: "usd",
    interval: "month",
    description: "Enterprise lead generation - unlimited leads",
    service: "leads",
    tier: "enterprise",
    features: [
      "Unlimited daily leads",
      "White-label option",
      "API access",
      "Custom integrations",
      "Dedicated support",
    ],
  },

  // AUDIT SERVICE
  AUDIT_STARTER: {
    name: "Audit - Starter",
    price: 11100, // $111.00 in cents
    currency: "usd",
    interval: "month",
    description: "Google Maps audit - 5 audits/month",
    service: "audit",
    tier: "starter",
    features: ["5 audits per month", "Basic grounding report", "Email support"],
  },
  AUDIT_PROFESSIONAL: {
    name: "Audit - Professional",
    price: 22200, // $222.00 in cents
    currency: "usd",
    interval: "month",
    description: "Google Maps audit - 20 audits/month",
    service: "audit",
    tier: "professional",
    features: [
      "20 audits per month",
      "Detailed grounding report",
      "Recommendations included",
      "Priority support",
    ],
  },
  AUDIT_ENTERPRISE: {
    name: "Audit - Enterprise",
    price: 33300, // $333.00 in cents
    currency: "usd",
    interval: "month",
    description: "Google Maps audit - unlimited audits",
    service: "audit",
    tier: "enterprise",
    features: [
      "Unlimited audits per month",
      "White-label reports",
      "Priority support",
      "Custom branding",
    ],
  },
  AUDIT_PREMIUM_PLUS: {
    name: "Audit - Premium Plus",
    price: 55500, // $555.00 in cents
    currency: "usd",
    interval: "month",
    description: "Google Maps audit - premium with strategy calls",
    service: "audit",
    tier: "premium_plus",
    features: [
      "Unlimited audits per month",
      "White-label reports",
      "Quarterly strategy calls",
      "Priority support",
      "Custom integrations",
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
 * Get all available tiers for a service
 */
export function getAvailableTiersByService(service: "leads" | "audit") {
  return Object.entries(STRIPE_PRODUCTS)
    .filter(([_, product]: any) => product.service === service)
    .map(([key, product]: any) => ({
      id: key.toLowerCase().replace(/_/g, "-"),
      name: product.name,
      price: product.price,
      description: product.description,
      tier: product.tier,
      features: product.features,
    }));
}

/**
 * Get all available tiers
 */
export function getAvailableTiers() {
  return Object.entries(STRIPE_PRODUCTS).map(([key, product]: any) => ({
    id: key.toLowerCase().replace(/_/g, "-"),
    name: product.name,
    price: product.price,
    description: product.description,
    service: product.service,
    tier: product.tier,
    features: product.features,
  }));
}

/**
 * Calculate combined price for multiple services
 */
export function calculateCombinedPrice(
  leadsPrice: number | null,
  auditPrice: number | null
): number {
  return (leadsPrice || 0) + (auditPrice || 0);
}
