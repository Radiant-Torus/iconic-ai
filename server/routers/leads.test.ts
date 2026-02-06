import { describe, it, expect } from "vitest";
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
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Leads Router", () => {
  describe("getAvailableNiches", () => {
    it("should return a list of available niches", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const niches = await caller.leads.getAvailableNiches();

      expect(Array.isArray(niches)).toBe(true);
      expect(niches.length).toBeGreaterThan(0);
      expect(niches).toContain("Holistic Wellness");
      expect(niches).toContain("Spiritual Coaching");
    });

    it("should include all expected niches", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const niches = await caller.leads.getAvailableNiches();

      const expectedNiches = [
        "Holistic Wellness",
        "Spiritual Coaching",
        "Digital Marketing",
        "Real Estate",
        "Financial Services",
      ];

      for (const niche of expectedNiches) {
        expect(niches).toContain(niche);
      }
    });
  });

  describe("getNicheSourceMapping", () => {
    it("should return sources for a valid niche", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const mapping = await caller.leads.getNicheSourceMapping({
        niche: "Holistic Wellness",
      });

      expect(mapping).toHaveProperty("niche");
      expect(mapping).toHaveProperty("sources");
      expect(mapping.niche).toBe("Holistic Wellness");
      expect(Array.isArray(mapping.sources)).toBe(true);
      expect(mapping.sources.length).toBeGreaterThan(0);
    });

    it("should return sources including Google Business Profiles for Holistic Wellness", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const mapping = await caller.leads.getNicheSourceMapping({
        niche: "Holistic Wellness",
      });

      expect(mapping.sources).toContain("Google Business Profiles");
      expect(mapping.sources).toContain("Yelp & Local Directories");
    });

    it("should return sources including LinkedIn for Spiritual Coaching", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const mapping = await caller.leads.getNicheSourceMapping({
        niche: "Spiritual Coaching",
      });

      expect(mapping.sources).toContain("LinkedIn");
      expect(mapping.sources).toContain("Coach Directories");
    });

    it("should return empty sources for unknown niche", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: () => {} } as any,
      });

      const mapping = await caller.leads.getNicheSourceMapping({
        niche: "Unknown Niche That Does Not Exist",
      });

      expect(mapping.sources).toEqual([]);
    });
  });

  describe("getPartnerProfile", () => {
    it("should return partner profile for authenticated user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const profile = await caller.leads.getPartnerProfile();

      // Partner is auto-created for new users
      expect(profile).not.toBeNull();
      expect(profile).toHaveProperty("id");
      expect(profile).toHaveProperty("userId");
      expect(profile).toHaveProperty("businessName");
      expect(profile).toHaveProperty("niche");
      expect(profile?.userId).toBe(1);
    });
  });

  describe("getTodaysHotLeads", () => {
    it("should return empty array for a user with no leads", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const leads = await caller.leads.getTodaysHotLeads();

      expect(Array.isArray(leads)).toBe(true);
      expect(leads.length).toBe(0);
    });
  });
});
