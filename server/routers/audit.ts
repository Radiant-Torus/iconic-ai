import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { auditServices, audits } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Audit service tiers with angel numbers
const AUDIT_TIERS = [
  {
    id: "starter",
    name: "Starter Audit",
    price: 11100,
    priceUSD: "$111.00/month",
    maxAuditsPerMonth: 5,
    description: "5 audits per month, basic reports",
  },
  {
    id: "professional",
    name: "Professional Audit",
    price: 22200,
    priceUSD: "$222.00/month",
    maxAuditsPerMonth: 20,
    description: "20 audits per month, detailed reports + recommendations",
  },
  {
    id: "enterprise",
    name: "Enterprise Audit",
    price: 33300,
    priceUSD: "$333.00/month",
    maxAuditsPerMonth: 999999,
    description: "Unlimited audits, white-label reports",
  },
  {
    id: "premium_plus",
    name: "Premium Plus",
    price: 55500,
    priceUSD: "$555.00/month",
    maxAuditsPerMonth: 999999,
    description: "Everything + quarterly strategy calls",
  },
];

// Admin-only procedure
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

export const auditRouter = router({
  // Get all audit service tiers
  getAuditTiers: protectedProcedure.query(() => {
    return AUDIT_TIERS;
  }),

  // Get admin's current audit service subscription
  getAuditSubscription: adminProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const subscription = await db
      .select()
      .from(auditServices)
      .where(eq(auditServices.userId, ctx.user.id))
      .limit(1);

    if (!subscription.length) {
      return {
        status: "no_subscription",
        tier: null,
        auditsUsedThisMonth: 0,
        maxAuditsPerMonth: 0,
      };
    }

    const sub = subscription[0];
    const tierInfo = AUDIT_TIERS.find((t) => t.id === sub.tier);

    return {
      status: sub.status,
      tier: sub.tier,
      maxAuditsPerMonth: sub.maxAuditsPerMonth,
      auditsUsedThisMonth: 0,
      subscriptionId: sub.stripeSubscriptionId,
      tierInfo,
    };
  }),

  // Create a new audit
  createAudit: adminProcedure
    .input(
      z.object({
        businessName: z.string().min(1),
        businessAddress: z.string().optional(),
        googleMapsUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const auditService = await db
        .select()
        .from(auditServices)
        .where(eq(auditServices.userId, ctx.user.id))
        .limit(1);

      if (!auditService.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active audit service subscription",
        });
      }

      await db.insert(audits).values({
        auditServiceId: auditService[0].id,
        businessName: input.businessName,
        businessAddress: input.businessAddress,
        googleMapsUrl: input.googleMapsUrl,
        status: "pending",
        groundingScore: 0,
      });

      return {
        businessName: input.businessName,
        status: "pending",
        createdAt: new Date(),
      };
    }),

  // Get all audits for admin
  getAudits: adminProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const auditService = await db
      .select()
      .from(auditServices)
      .where(eq(auditServices.userId, ctx.user.id))
      .limit(1);

    if (!auditService.length) {
      return [];
    }

    const auditList = await db
      .select()
      .from(audits)
      .where(eq(audits.auditServiceId, auditService[0].id));

    return auditList;
  }),

  // Update audit with grounding score
  updateAuditScore: adminProcedure
    .input(
      z.object({
        auditId: z.number(),
        groundingScore: z.number().min(0).max(100),
        hallucinations: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(audits)
        .set({
          groundingScore: input.groundingScore,
          hallucinations: input.hallucinations
            ? JSON.stringify(input.hallucinations)
            : null,
          status: input.groundingScore < 80 ? "flagged" : "completed",
        })
        .where(eq(audits.id, input.auditId));

      return {
        id: input.auditId,
        groundingScore: input.groundingScore,
        status: input.groundingScore < 80 ? "flagged" : "completed",
      };
    }),

  // Get audit details
  getAuditDetails: adminProcedure
    .input(z.object({ auditId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const audit = await db
        .select()
        .from(audits)
        .where(eq(audits.id, input.auditId))
        .limit(1);

      if (!audit.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const auditData = audit[0];
      return {
        ...auditData,
        hallucinations: auditData.hallucinations
          ? JSON.parse(auditData.hallucinations)
          : [],
      };
    }),
});
