import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
type StripeClient = Stripe;
import { getDb } from "../db";
import { partners, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getAvailableTiers, calculateCombinedPrice } from "../stripe/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const paymentRouter = router({
  /**
   * Get available pricing tiers for both services
   */
  getPricingTiers: publicProcedure.query(async () => {
    return getAvailableTiers().map((tier) => ({
      id: tier.id,
      name: tier.name,
      price: tier.price,
      priceUSD: `$${(tier.price / 100).toFixed(2)}`,
      service: tier.service,
      tier: tier.tier,
      features: tier.features,
    }));
  }),

  /**
   * Create a checkout session for one or both services
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        leadsService: z.enum(["basic", "professional", "enterprise"]).optional(),
        auditService: z.enum(["starter", "professional", "enterprise", "premium_plus"]).optional(),
        metaAuditService: z.enum(["starter", "professional", "done_for_you"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Must select at least one service
      if (!input.leadsService && !input.auditService && !input.metaAuditService) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please select at least one service",
        });
      }

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
        }

        // Build line items based on selected services
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
        let totalPrice = 0;
        let serviceDescription = "";

        // Add leads service if selected
        if (input.leadsService) {
          const leadsKey = `LEADS_${input.leadsService.toUpperCase()}`;
          const leadsProduct = (require("../stripe/products").STRIPE_PRODUCTS as any)[leadsKey];
          if (leadsProduct) {
            lineItems.push({
              price_data: {
                currency: "usd",
                product_data: {
                  name: leadsProduct.name,
                  description: leadsProduct.description,
                },
                unit_amount: leadsProduct.price,
                recurring: {
                  interval: "month",
                },
              },
              quantity: 1,
            });
            totalPrice += leadsProduct.price;
            serviceDescription += `Leads (${input.leadsService}) `;
          }
        }

        // Add audit service if selected
        if (input.auditService) {
          const auditKey = `AUDIT_${input.auditService.toUpperCase().replace(/_/g, "_")}`;
          const auditProduct = (require("../stripe/products").STRIPE_PRODUCTS as any)[auditKey];
          if (auditProduct) {
            lineItems.push({
              price_data: {
                currency: "usd",
                product_data: {
                  name: auditProduct.name,
                  description: auditProduct.description,
                },
                unit_amount: auditProduct.price,
                recurring: {
                  interval: "month",
                },
              },
              quantity: 1,
            });
            totalPrice += auditProduct.price;
            serviceDescription += `Audit (${input.auditService}) `;
          }
        }

        // Add meta audit service if selected
        if (input.metaAuditService) {
          const metaKey = `META_AUDIT_${input.metaAuditService.toUpperCase().replace(/_/g, "_")}`;
          const metaProduct = (require("../stripe/products").STRIPE_PRODUCTS as any)[metaKey];
          if (metaProduct) {
            lineItems.push({
              price_data: {
                currency: "usd",
                product_data: {
                  name: metaProduct.name,
                  description: metaProduct.description,
                },
                unit_amount: metaProduct.price,
                recurring: {
                  interval: "month",
                },
              },
              quantity: 1,
            });
            totalPrice += metaProduct.price;
            serviceDescription += `Meta Audit (${input.metaAuditService})`;
          }
        }

        if (lineItems.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid service selection",
          });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "subscription",
          success_url: `${ctx.req.headers.origin || "https://radiant-torus.manus.space"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin || "https://radiant-torus.manus.space"}/pricing`,
          metadata: {
            userId: ctx.user.id.toString(),
            partnerId: partnerId.toString(),
            leadsService: input.leadsService || "none",
            auditService: input.auditService || "none",
            metaAuditService: input.metaAuditService || "none",
            totalPrice: totalPrice.toString(),
          },
          allow_promotion_codes: true,
        });

        return {
          sessionId: session.id,
          url: session.url,
          totalPrice,
          totalPriceUSD: `$${(totalPrice / 100).toFixed(2)}`,
          services: serviceDescription.trim(),
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

      if (!partner.length) {
        return null;
      }

      return {
        tier: partner[0].pricingTier,
        status: partner[0].subscriptionStatus,
        renewalDate: partner[0].subscriptionRenewalDate,
      };
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch subscription status",
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

      if (!partner.length || !partner[0].stripeSubscriptionId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active subscription found",
        });
      }

      // Cancel subscription in Stripe
      await stripe.subscriptions.update(partner[0].stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

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
