import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
type StripeClient = Stripe;
import { getDb } from "../db";
import { partners, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Pricing tiers configuration
 */
const PRICING_TIERS = {
  basic: {
    name: "Basic",
    price: 11100, // $111.00 in cents
    priceId: process.env.STRIPE_BASIC_PRICE_ID || "price_basic_placeholder",
  },
  agency_partner: {
    name: "Agency Partner",
    price: 22200, // $222.00 in cents
    priceId: process.env.STRIPE_AGENCY_PARTNER_PRICE_ID || "price_agency_placeholder",
  },
  elite: {
    name: "Elite",
    price: 33300, // $333.00 in cents
    priceId: process.env.STRIPE_ELITE_PRICE_ID || "price_elite_placeholder",
  },
};

export const paymentRouter = router({
  /**
   * Get available pricing tiers
   */
  getPricingTiers: publicProcedure.query(async () => {
    return Object.entries(PRICING_TIERS).map(([key, tier]) => ({
      id: key,
      name: tier.name,
      price: tier.price,
      priceUSD: `$${(tier.price / 100).toFixed(2)}`,
    }));
  }),

  /**
   * Create a checkout session for a pricing tier
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        tier: z.enum(["basic", "agency_partner", "elite"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Get or create partner
        const existingPartner = await db
          .select()
          .from(partners)
          .where(eq(partners.userId, ctx.user.id))
          .limit(1);

        let partnerId: number;

        if (existingPartner.length > 0) {
          partnerId = existingPartner[0].id;
        } else {
          // Create new partner
          const result = await db.insert(partners).values({
            userId: ctx.user.id,
            businessName: ctx.user.name || "My Business",
            niche: "General",
            email: ctx.user.email || "",
          });
          partnerId = (result as any).insertId;
        }

        // Get or create Stripe customer
        let stripeCustomerId = ctx.user.stripeCustomerId;

        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: ctx.user.email || undefined,
            name: ctx.user.name || undefined,
            metadata: {
              userId: ctx.user.id.toString(),
              partnerId: partnerId.toString(),
            },
          });
          stripeCustomerId = customer.id;

          // Update user with Stripe customer ID
          // Note: This would require a mutation in the users table
          // For now, we'll just use the ID from the session
        }

        const tierConfig = PRICING_TIERS[input.tier];
        if (!tierConfig) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid pricing tier",
          });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          payment_method_types: ["card"],
          line_items: [
            {
              price: tierConfig.priceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${ctx.req.headers.origin || "https://iconic-ai-leads.manus.space"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin || "https://iconic-ai-leads.manus.space"}/pricing`,
          metadata: {
            userId: ctx.user.id.toString(),
            partnerId: partnerId.toString(),
            tier: input.tier,
          },
          allow_promotion_codes: true,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("Error creating checkout session:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  /**
   * Get current subscription status
   */
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      const partner = await db
        .select()
        .from(partners)
        .where(eq(partners.userId, ctx.user.id))
        .limit(1);

      if (partner.length === 0) {
        return {
          status: "no_partner",
          tier: null,
          subscriptionId: null,
        };
      }

      const partnerData = partner[0];

      return {
        status: partnerData.subscriptionStatus || "inactive",
        tier: partnerData.pricingTier || "basic",
        subscriptionId: partnerData.stripeSubscriptionId,
        startDate: partnerData.subscriptionStartDate,
        renewalDate: partnerData.subscriptionRenewalDate,
      };
    } catch (error) {
      console.error("Error getting subscription status:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get subscription status",
      });
    }
  }),

  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      const partner = await db
        .select()
        .from(partners)
        .where(eq(partners.userId, ctx.user.id))
        .limit(1);

      if (partner.length === 0 || !partner[0].stripeSubscriptionId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active subscription found",
        });
      }

      // Cancel subscription in Stripe
      await stripe.subscriptions.cancel(partner[0].stripeSubscriptionId);

      // Update partner subscription status
      await db
        .update(partners)
        .set({
          subscriptionStatus: "canceled",
          pricingTier: "basic",
        })
        .where(eq(partners.id, partner[0].id));

      return { success: true };
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to cancel subscription",
      });
    }
  }),
});
