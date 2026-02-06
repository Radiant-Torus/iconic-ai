import { describe, it, expect } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-admin",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
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

describe("Audit Router", () => {
  describe("getAuditTiers", () => {
    it("should return all audit service tiers", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const tiers = await caller.audit.getAuditTiers();

      expect(Array.isArray(tiers)).toBe(true);
      expect(tiers.length).toBe(4);
    });

    it("should include starter tier with $111 price", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const tiers = await caller.audit.getAuditTiers();
      const starter = tiers.find((t) => t.id === "starter");

      expect(starter).toBeDefined();
      expect(starter?.price).toBe(11100);
      expect(starter?.priceUSD).toBe("$111.00/month");
      expect(starter?.maxAuditsPerMonth).toBe(5);
    });

    it("should include professional tier with $222 price", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const tiers = await caller.audit.getAuditTiers();
      const professional = tiers.find((t) => t.id === "professional");

      expect(professional).toBeDefined();
      expect(professional?.price).toBe(22200);
      expect(professional?.priceUSD).toBe("$222.00/month");
      expect(professional?.maxAuditsPerMonth).toBe(20);
    });

    it("should include enterprise tier with $333 price", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const tiers = await caller.audit.getAuditTiers();
      const enterprise = tiers.find((t) => t.id === "enterprise");

      expect(enterprise).toBeDefined();
      expect(enterprise?.price).toBe(33300);
      expect(enterprise?.priceUSD).toBe("$333.00/month");
      expect(enterprise?.maxAuditsPerMonth).toBe(999999);
    });

    it("should include premium_plus tier with $555 price", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const tiers = await caller.audit.getAuditTiers();
      const premiumPlus = tiers.find((t) => t.id === "premium_plus");

      expect(premiumPlus).toBeDefined();
      expect(premiumPlus?.price).toBe(55500);
      expect(premiumPlus?.priceUSD).toBe("$555.00/month");
    });
  });

  describe("getAuditSubscription", () => {
    it("should require admin role", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      try {
        await caller.audit.getAuditSubscription();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should return subscription status for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const subscription = await caller.audit.getAuditSubscription();

      expect(subscription).toBeDefined();
      expect(subscription).toHaveProperty("status");
      expect(subscription).toHaveProperty("tier");
      expect(subscription).toHaveProperty("maxAuditsPerMonth");
    });
  });

  describe("createAudit", () => {
    it("should require admin role", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      try {
        await caller.audit.createAudit({
          businessName: "Test Business",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should fail if no audit service subscription", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.audit.createAudit({
          businessName: "Test Business",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });

  describe("Pricing structure", () => {
    it("should have angel number pricing", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const tiers = await caller.audit.getAuditTiers();
      const prices = tiers.map((t) => t.price);

      expect(prices).toEqual([11100, 22200, 33300, 55500]);
    });

    it("should have ascending prices", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const tiers = await caller.audit.getAuditTiers();
      const sorted = [...tiers].sort((a, b) => a.price - b.price);

      expect(tiers).toEqual(sorted);
    });
  });
});
