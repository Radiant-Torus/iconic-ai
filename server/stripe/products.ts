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
    priceId: "price_1T11Iz2SH1dm83HB8fxMcAxF", // Stripe Live Price ID
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
    priceId: "price_1T11J02SH1dm83HBHzFv8LOr", // Stripe Live Price ID
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
    priceId: "price_1T11J22SH1dm83HBW81zvCAr", // Stripe Live Price ID
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
    priceId: "price_1T11J32SH1dm83HBSC9RsgWW", // Stripe Live Price ID
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
    priceId: "price_1T11J52SH1dm83HBQEtD5qwm", // Stripe Live Price ID
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
    priceId: "price_1T11J62SH1dm83HBktiue3Vg", // Stripe Live Price ID
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
    priceId: "price_1T11J72SH1dm83HBK0BtbYc8", // Stripe Live Price ID
  },

  // META ADS AUDIT SERVICE
  META_AUDIT_STARTER: {
    name: "Meta Ads Audit - Starter",
    price: 29700, // $297.00 in cents
    currency: "usd",
    interval: "month",
    description: "One-time Meta ads campaign audit with analysis",
    service: "meta_audit",
    tier: "starter",
    features: [
      "Campaign performance analysis",
      "Audience insights",
      "Budget optimization review",
      "Detailed audit report",
    ],
    priceId: "price_1T4BM12SH1dm83HBQSUdTo54", // Stripe Live Price ID
  },
  META_AUDIT_PROFESSIONAL: {
    name: "Meta Ads Audit - Professional",
    price: 59700, // $597.00 in cents
    currency: "usd",
    interval: "month",
    description: "Comprehensive Meta ads audit with recommendations",
    service: "meta_audit",
    tier: "professional",
    features: [
      "Full campaign analysis",
      "Audience segmentation review",
      "Creative performance breakdown",
      "Actionable recommendations",
      "Implementation roadmap",
      "30-min strategy call",
    ],
    priceId: "price_1T4BM42SH1dm83HBCmIQWdM6", // Stripe Live Price ID
  },
  META_AUDIT_DONE_FOR_YOU: {
    name: "Meta Ads Audit - Done-For-You",
    price: 149700, // $1,497.00 in cents
    currency: "usd",
    interval: "month",
    description: "Full Meta ads optimization with implementation",
    service: "meta_audit",
    tier: "done_for_you",
    features: [
      "Complete audit & analysis",
      "Campaign restructuring",
      "Audience optimization",
      "Creative testing setup",
      "Budget reallocation",
      "Monthly optimization",
      "Quarterly strategy calls",
      "Dedicated support",
    ],
    priceId: "price_1T4BM52SH1dm83HBrP8YHOjD", // Stripe Live Price ID
  },

  // BUNDLE PACKAGES - Save 20%
  BUNDLE_LEADS_AUDIT: {
    name: "Bundle - Lead Gen + Maps Audit",
    price: 29900, // $299.00 in cents (20% off $374)
    currency: "usd",
    interval: "month",
    description: "Lead Generation (Professional) + Google Maps Audit (Professional) - Save 20%",
    service: "bundle",
    tier: "leads_audit",
    features: [
      "20 leads per day",
      "20 audits per month",
      "Advanced dashboard",
      "Priority support",
      "20% savings vs individual tiers",
    ],
    priceId: "price_bundle_leads_audit", // Will be created via API
  },
  BUNDLE_ALL_THREE: {
    name: "Bundle - All Three Services",
    price: 59900, // $599.00 in cents (20% off $749)
    currency: "usd",
    interval: "month",
    description: "Lead Gen + Maps Audit + Meta Audit (Professional) - Save 20%",
    service: "bundle",
    tier: "all_three",
    features: [
      "20 leads per day",
      "20 audits per month",
      "Full Meta ads analysis",
      "Advanced dashboard",
      "Priority support",
      "30-min strategy call",
      "20% savings vs individual tiers",
    ],
    priceId: "price_bundle_all_three", // Will be created via API
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
export function getAvailableTiersByService(service: "leads" | "audit" | "meta_audit" | "bundle") {
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
  auditPrice: number | null,
  metaAuditPrice: number | null = null
): number {
  return (leadsPrice || 0) + (auditPrice || 0) + (metaAuditPrice || 0);
}
