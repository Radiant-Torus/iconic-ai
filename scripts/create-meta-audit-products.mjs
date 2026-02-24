#!/usr/bin/env node

import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("❌ Error: STRIPE_SECRET_KEY environment variable is not set");
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

async function createMetaAuditProducts() {
  try {
    console.log("🚀 Creating Meta Ads Audit Products in Stripe...\n");

    // Meta Audit - Starter ($297/month)
    console.log("Creating Meta Audit - Starter ($297/month)...");
    const starterProduct = await stripe.products.create({
      name: "Meta Ads Audit - Starter",
      description: "One-time Meta ads campaign audit with analysis",
      type: "service",
      metadata: {
        service: "meta_audit",
        tier: "starter",
      },
    });

    const starterPrice = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 29700, // $297.00 in cents
      currency: "usd",
      recurring: {
        interval: "month",
        usage_type: "licensed",
      },
      metadata: {
        tier: "starter",
      },
    });

    console.log(
      `✅ Meta Audit Starter created: ${starterPrice.id}\n`
    );

    // Meta Audit - Professional ($597/month)
    console.log("Creating Meta Audit - Professional ($597/month)...");
    const professionalProduct = await stripe.products.create({
      name: "Meta Ads Audit - Professional",
      description: "Comprehensive Meta ads audit with recommendations",
      type: "service",
      metadata: {
        service: "meta_audit",
        tier: "professional",
      },
    });

    const professionalPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 59700, // $597.00 in cents
      currency: "usd",
      recurring: {
        interval: "month",
        usage_type: "licensed",
      },
      metadata: {
        tier: "professional",
      },
    });

    console.log(
      `✅ Meta Audit Professional created: ${professionalPrice.id}\n`
    );

    // Meta Audit - Done-For-You ($1,497/month)
    console.log("Creating Meta Audit - Done-For-You ($1,497/month)...");
    const doneForYouProduct = await stripe.products.create({
      name: "Meta Ads Audit - Done-For-You",
      description: "Full Meta ads optimization with implementation",
      type: "service",
      metadata: {
        service: "meta_audit",
        tier: "done_for_you",
      },
    });

    const doneForYouPrice = await stripe.prices.create({
      product: doneForYouProduct.id,
      unit_amount: 149700, // $1,497.00 in cents
      currency: "usd",
      recurring: {
        interval: "month",
        usage_type: "licensed",
      },
      metadata: {
        tier: "done_for_you",
      },
    });

    console.log(
      `✅ Meta Audit Done-For-You created: ${doneForYouPrice.id}\n`
    );

    // Summary
    console.log("═══════════════════════════════════════════════════════");
    console.log("✅ ALL META AUDIT PRODUCTS CREATED SUCCESSFULLY!\n");
    console.log("📋 PRICE IDs FOR YOUR CONFIG:\n");
    console.log(`META_AUDIT_STARTER:     ${starterPrice.id}`);
    console.log(`META_AUDIT_PROFESSIONAL: ${professionalPrice.id}`);
    console.log(`META_AUDIT_DONE_FOR_YOU: ${doneForYouPrice.id}`);
    console.log("\n═══════════════════════════════════════════════════════");
    console.log("✨ Copy these Price IDs into your products.ts file!\n");
  } catch (error) {
    console.error("❌ Error creating products:", error.message);
    process.exit(1);
  }
}

createMetaAuditProducts();
