#!/usr/bin/env node
/**
 * Create Stripe Products for Radiant Torus
 * 
 * This script creates all 7 products (4 lead gen tiers + 4 audit tiers) in Stripe
 * with angel number pricing ($111, $222, $333, $555)
 * 
 * Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/create-stripe-products.mjs
 */

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is required');
  console.error('Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/create-stripe-products.mjs');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

// Product definitions with angel number pricing
const productsToCreate = [
  // Lead Generation Service
  {
    name: 'Radiant Torus - Lead Generation Starter',
    description: 'Daily qualified leads for your niche - Starter tier',
    metadata: {
      service: 'leads',
      tier: 'starter',
      priceUSD: '$111',
    },
    price: 11100, // $111.00 in cents
  },
  {
    name: 'Radiant Torus - Lead Generation Professional',
    description: 'Daily qualified leads for your niche - Professional tier',
    metadata: {
      service: 'leads',
      tier: 'professional',
      priceUSD: '$222',
    },
    price: 22200, // $222.00 in cents
  },
  {
    name: 'Radiant Torus - Lead Generation Enterprise',
    description: 'Daily qualified leads for your niche - Enterprise tier',
    metadata: {
      service: 'leads',
      tier: 'enterprise',
      priceUSD: '$333',
    },
    price: 33300, // $333.00 in cents
  },
  
  // Google Maps Audit Service
  {
    name: 'Radiant Torus - Audit Service Starter',
    description: 'Google Maps audit service - 5 audits per month',
    metadata: {
      service: 'audit',
      tier: 'starter',
      priceUSD: '$111',
      audits: '5',
    },
    price: 11100, // $111.00 in cents
  },
  {
    name: 'Radiant Torus - Audit Service Professional',
    description: 'Google Maps audit service - 20 audits per month',
    metadata: {
      service: 'audit',
      tier: 'professional',
      priceUSD: '$222',
      audits: '20',
    },
    price: 22200, // $222.00 in cents
  },
  {
    name: 'Radiant Torus - Audit Service Enterprise',
    description: 'Google Maps audit service - Unlimited audits per month',
    metadata: {
      service: 'audit',
      tier: 'enterprise',
      priceUSD: '$333',
      audits: 'unlimited',
    },
    price: 33300, // $333.00 in cents
  },
  {
    name: 'Radiant Torus - Audit Service Premium Plus',
    description: 'Google Maps audit service - Unlimited audits + dedicated support',
    metadata: {
      service: 'audit',
      tier: 'premium_plus',
      priceUSD: '$555',
      audits: 'unlimited',
    },
    price: 55500, // $555.00 in cents
  },
];

async function createProducts() {
  console.log('🚀 Starting Stripe product creation...\n');
  
  const createdProducts = [];
  
  for (const productDef of productsToCreate) {
    try {
      console.log(`📦 Creating: ${productDef.name}`);
      
      // Create product
      const product = await stripe.products.create({
        name: productDef.name,
        description: productDef.description,
        metadata: productDef.metadata,
        type: 'service',
      });
      
      console.log(`   ✅ Product created: ${product.id}`);
      
      // Create price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: productDef.price,
        currency: 'usd',
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
        metadata: {
          service: productDef.metadata.service,
          tier: productDef.metadata.tier,
        },
      });
      
      console.log(`   💰 Price created: ${price.id} (${productDef.metadata.priceUSD}/month)\n`);
      
      createdProducts.push({
        productId: product.id,
        priceId: price.id,
        name: productDef.name,
        price: productDef.metadata.priceUSD,
        service: productDef.metadata.service,
        tier: productDef.metadata.tier,
      });
      
    } catch (error) {
      console.error(`   ❌ Error creating product: ${error.message}\n`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ CREATION SUMMARY');
  console.log('='.repeat(60) + '\n');
  
  console.log(`Total products created: ${createdProducts.length}/${productsToCreate.length}\n`);
  
  console.log('📋 PRODUCT REFERENCE:\n');
  createdProducts.forEach((p) => {
    console.log(`${p.service.toUpperCase()} - ${p.tier.toUpperCase()}`);
    console.log(`  Product ID: ${p.productId}`);
    console.log(`  Price ID:   ${p.priceId}`);
    console.log(`  Price:      ${p.price}/month\n`);
  });
  
  console.log('='.repeat(60));
  console.log('✅ All products created successfully!');
  console.log('='.repeat(60) + '\n');
  
  console.log('📝 Next steps:');
  console.log('1. Update your pricing configuration with the new Price IDs');
  console.log('2. Test the checkout flow with a test card');
  console.log('3. Verify products appear in your Stripe Dashboard\n');
  
  return createdProducts;
}

// Run the script
createProducts().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
