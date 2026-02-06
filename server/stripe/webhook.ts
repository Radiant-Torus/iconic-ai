import Stripe from "stripe";
import { Request, Response } from "express";
import { getDb } from "../db";
import { partners, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Handle Stripe webhook events
 * This function processes subscription and payment events from Stripe
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  try {
    const db = await getDb();
    if (!db) {
      console.error("Database not available");
      return res.status(500).json({ error: "Database not available" });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Webhook] Checkout session completed:", session.id);

        if (session.client_reference_id && session.metadata?.partnerId) {
          const partnerId = parseInt(session.metadata.partnerId);
          const tier = session.metadata.tier || "basic";

          // Get subscription from Stripe
          if (session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );

            // Create subscription record
            await db.insert(subscriptions).values({
              partnerId,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0]?.price.id || "",
              status: subscription.status,
              currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            });

            // Update partner subscription status
            await db
              .update(partners)
              .set({
                stripeSubscriptionId: subscription.id,
                subscriptionStatus: subscription.status,
                pricingTier: tier,
                subscriptionStartDate: new Date((subscription as any).current_period_start * 1000),
                subscriptionRenewalDate: new Date((subscription as any).current_period_end * 1000),
              })
              .where(eq(partners.id, partnerId));

            console.log(`[Webhook] Updated partner ${partnerId} with subscription ${subscription.id}`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("[Webhook] Subscription updated:", subscription.id);

        // Find and update subscription record
        const existingSubscription = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
          .limit(1);

        if (existingSubscription.length > 0) {
          await db
            .update(subscriptions)
            .set({
              status: subscription.status,
              currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

          // Update partner status
          const partnerId = existingSubscription[0].partnerId;
          await db
            .update(partners)
            .set({
              subscriptionStatus: subscription.status,
              subscriptionRenewalDate: new Date((subscription as any).current_period_end * 1000),
            })
            .where(eq(partners.id, partnerId));

          console.log(`[Webhook] Updated subscription ${subscription.id} status to ${subscription.status}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("[Webhook] Subscription deleted:", subscription.id);

        // Update subscription record
        const existingSubscription = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
          .limit(1);

        if (existingSubscription.length > 0) {
          await db
            .update(subscriptions)
            .set({
              status: "canceled",
              canceledAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

          // Update partner status
          const partnerId = existingSubscription[0].partnerId;
          await db
            .update(partners)
            .set({
              subscriptionStatus: "canceled",
              pricingTier: "basic",
            })
            .where(eq(partners.id, partnerId));

          console.log(`[Webhook] Canceled subscription ${subscription.id}`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("[Webhook] Invoice payment succeeded:", invoice.id);

        // Update subscription if needed
        if ((invoice as any).subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            (invoice as any).subscription as string
          );

          const existingSubscription = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
            .limit(1);

          if (existingSubscription.length > 0) {
            await db
              .update(subscriptions)
              .set({
                status: subscription.status,
              })
              .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

            const partnerId = existingSubscription[0].partnerId;
            await db
              .update(partners)
              .set({
                subscriptionStatus: subscription.status,
              })
              .where(eq(partners.id, partnerId));
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("[Webhook] Invoice payment failed:", invoice.id);

        if ((invoice as any).subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            (invoice as any).subscription as string
          );

          const existingSubscription = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
            .limit(1);

          if (existingSubscription.length > 0) {
            await db
              .update(subscriptions)
              .set({
                status: "past_due",
              })
              .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

            const partnerId = existingSubscription[0].partnerId;
            await db
              .update(partners)
              .set({
                subscriptionStatus: "past_due",
              })
              .where(eq(partners.id, partnerId));
          }
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
