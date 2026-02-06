import { describe, it, expect, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {
        origin: "https://localhost:3000",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Payment Router", () => {
  describe("getPricingTiers", () => {
    it("should return all available pricing tiers", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const tiers = await caller.payment.getPricingTiers();

      expect(Array.isArray(tiers)).toBe(true);
      expect(tiers.length).toBe(3);
    });

    it("should include basic tier with correct price", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const tiers = await caller.payment.getPricingTiers();
      const basicTier = tiers.find((t) => t.id === "basic");

      expect(basicTier).toBeDefined();
      expect(basicTier?.price).toBe(11100);
      expect(basicTier?.priceUSD).toBe("$111.00");
    });

    it("should include agency_partner tier with correct price", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const tiers = await caller.payment.getPricingTiers();
      const agencyTier = tiers.find((t) => t.id === "agency_partner");

      expect(agencyTier).toBeDefined();
      expect(agencyTier?.price).toBe(22200);
      expect(agencyTier?.priceUSD).toBe("$222.00");
    });

    it("should include elite tier with correct price", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const tiers = await caller.payment.getPricingTiers();
      const eliteTier = tiers.find((t) => t.id === "elite");

      expect(eliteTier).toBeDefined();
      expect(eliteTier?.price).toBe(33300);
      expect(eliteTier?.priceUSD).toBe("$333.00");
    });
  });

  describe("getSubscriptionStatus", () => {
    it("should return subscription status for authenticated user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const status = await caller.payment.getSubscriptionStatus();

      expect(status).toBeDefined();
      expect(status).toHaveProperty("status");
      expect(status).toHaveProperty("tier");
      expect(status).toHaveProperty("subscriptionId");
      expect(["inactive", "no_partner"]).toContain(status.status);
    });

    it("should return inactive status for new user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const status = await caller.payment.getSubscriptionStatus();

      expect(["no_partner", "inactive"]).toContain(status.status);
    });
  });

  describe("createCheckoutSession", () => {
    it("should require authentication", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      try {
        await caller.payment.createCheckoutSession({
          tier: "basic",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should reject invalid tier", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.payment.createCheckoutSession({
          tier: "invalid_tier" as any,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toMatch(/BAD_REQUEST|PARSE_ERROR/);
      }
    });
  });

  describe("cancelSubscription", () => {
    it("should require authentication", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      try {
        await caller.payment.cancelSubscription();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should fail for user with no subscription", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.payment.cancelSubscription();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(["NOT_FOUND", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
      }
    });
  });

  describe("Pricing tier structure", () => {
    it("should have consistent pricing across tiers", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const tiers = await caller.payment.getPricingTiers();

      for (const tier of tiers) {
        expect(tier).toHaveProperty("id");
        expect(tier).toHaveProperty("name");
        expect(tier).toHaveProperty("price");
        expect(tier).toHaveProperty("priceUSD");

        expect(tier.price).toBeGreaterThan(0);
        expect(tier.priceUSD).toMatch(/^\$\d+\.\d{2}$/);
      }
    });

    it("should have ascending prices", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const tiers = await caller.payment.getPricingTiers();
      const sorted = [...tiers].sort((a, b) => a.price - b.price);

      expect(tiers).toEqual(sorted);
    });
  });
});
