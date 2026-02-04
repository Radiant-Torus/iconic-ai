import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { leads, partners, nicheMappings, InsertLead } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Sample leads data for different niches
 * This demonstrates AI-powered lead generation
 */
const SAMPLE_LEADS_BY_NICHE: Record<string, Omit<InsertLead, "partnerId">[]> = {
  "Holistic Wellness": [
    {
      businessName: "Serenity Yoga Studio",
      contactPerson: "Maria Rodriguez",
      email: "maria@serenityoga.local",
      phone: "(555) 234-5678",
      employees: 8,
      niche: "Holistic Wellness - Yoga",
      onlinePresence: "Minimal - Basic Facebook page only, no website",
      qualificationScore: 85,
      notes: "Active local business, strong community presence, needs digital marketing",
      leadSource: "Google Business Profiles",
    },
    {
      businessName: "Healing Hands Massage Therapy",
      contactPerson: "James Chen",
      email: "james.chen@healinghands.biz",
      phone: "(555) 345-6789",
      employees: 5,
      niche: "Holistic Wellness - Massage",
      onlinePresence: "Minimal - Google My Business only, no social media",
      qualificationScore: 90,
      notes: "Solo practitioner with 4 part-time staff, high demand, no online booking",
      leadSource: "Google Business Profiles",
    },
    {
      businessName: "Crystal & Chakra Wellness Center",
      contactPerson: "Sarah Mitchell",
      email: "sarah@crystalchakra.wellness",
      phone: "(555) 456-7890",
      employees: 12,
      niche: "Holistic Wellness - Energy Healing",
      onlinePresence: "Minimal - Outdated website from 2019, no email marketing",
      qualificationScore: 80,
      notes: "Growing business, word-of-mouth only, ready to scale with proper leads",
      leadSource: "Industry Directories",
    },
    {
      businessName: "Wellness Coaching by Diana",
      contactPerson: "Diana Thompson",
      email: "diana@wellnesscoachingbydiana.com",
      phone: "(555) 567-8901",
      employees: 3,
      niche: "Holistic Wellness - Life Coaching",
      onlinePresence: "Minimal - LinkedIn profile only, no website or social presence",
      qualificationScore: 88,
      notes: "Solopreneur with high-ticket services, seeking quality referrals",
      leadSource: "LinkedIn",
    },
    {
      businessName: "Ayurveda & Herbal Remedies",
      contactPerson: "Priya Patel",
      email: "priya@ayurvedaherbal.shop",
      phone: "(555) 678-9012",
      employees: 7,
      niche: "Holistic Wellness - Ayurveda",
      onlinePresence: "Minimal - Yelp listing only, no website or digital marketing",
      qualificationScore: 92,
      notes: "Established local business, strong reputation, completely offline",
      leadSource: "Yelp & Local Directories",
    },
  ],
  "Spiritual Coaching": [
    {
      businessName: "Divine Path Coaching",
      contactPerson: "Michael Torres",
      email: "michael@divinepath.coaching",
      phone: "(555) 789-0123",
      employees: 2,
      niche: "Spiritual Coaching",
      onlinePresence: "Minimal - Website only, no social media or email marketing",
      qualificationScore: 87,
      notes: "Established coach with strong local following, needs digital presence",
      leadSource: "Coach Directories",
    },
    {
      businessName: "Soul Alignment Mentoring",
      contactPerson: "Lisa Anderson",
      email: "lisa@soulsalignment.com",
      phone: "(555) 890-1234",
      employees: 1,
      niche: "Spiritual Coaching",
      onlinePresence: "Minimal - Facebook page only, no website",
      qualificationScore: 86,
      notes: "Solo practitioner with growing demand, ready to scale",
      leadSource: "Facebook Business Pages",
    },
  ],
};

/**
 * Niche to lead sources mapping
 * Determines the best data sources to pull leads from for each niche
 */
const NICHE_SOURCE_MAPPING: Record<string, string[]> = {
  "Holistic Wellness": [
    "Google Business Profiles",
    "Yelp & Local Directories",
    "Industry Directories",
    "LinkedIn",
    "Facebook Business Pages",
  ],
  "Spiritual Coaching": [
    "Coach Directories",
    "LinkedIn",
    "Facebook Business Pages",
    "Industry Associations",
    "Google Business Profiles",
  ],
  "Digital Marketing": [
    "LinkedIn",
    "Google Business Profiles",
    "Industry Directories",
    "Chamber of Commerce",
    "Business Listings",
  ],
  "Real Estate": [
    "MLS Listings",
    "Zillow",
    "Google Business Profiles",
    "Local Business Directories",
    "Chamber of Commerce",
  ],
  "Financial Services": [
    "LinkedIn",
    "Industry Directories",
    "Google Business Profiles",
    "Chamber of Commerce",
    "Business Associations",
  ],
};

export const leadsRouter = router({
  /**
   * Get available niches
   */
  getAvailableNiches: publicProcedure.query(async () => {
    return Object.keys(NICHE_SOURCE_MAPPING);
  }),

  /**
   * Get niche to source mapping
   */
  getNicheSourceMapping: publicProcedure
    .input(z.object({ niche: z.string() }))
    .query(async ({ input }) => {
      const sources = NICHE_SOURCE_MAPPING[input.niche] || [];
      return {
        niche: input.niche,
        sources,
      };
    }),

  /**
   * Generate leads for a specific niche
   * This is where AI would integrate to pull real leads from various sources
   */
  generateLeadsForNiche: protectedProcedure
    .input(z.object({ niche: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Get or create partner for this user
        const existingPartner = await db
          .select()
          .from(partners)
          .where(eq(partners.userId, ctx.user.id))
          .limit(1);

        let partnerId: number;

        if (existingPartner.length > 0) {
          partnerId = existingPartner[0].id;
          // Update partner's niche
          await db
            .update(partners)
            .set({ niche: input.niche })
            .where(eq(partners.id, partnerId));
        } else {
          // Create new partner
          const result = await db.insert(partners).values({
            userId: ctx.user.id,
            businessName: ctx.user.name || "My Business",
            niche: input.niche,
            email: ctx.user.email || "",
          });
          partnerId = (result as any).insertId;
        }

        // Get sample leads for this niche
        const sampleLeads = SAMPLE_LEADS_BY_NICHE[input.niche] || [];

        // Insert leads into database
        const insertedLeads = [];
        for (const leadData of sampleLeads) {
          const result = await db.insert(leads).values({
            ...leadData,
            partnerId,
          });
          insertedLeads.push(result);
        }

        // Store or update niche mapping
        const existingMapping = await db
          .select()
          .from(nicheMappings)
          .where(eq(nicheMappings.niche, input.niche))
          .limit(1);

        const sources = NICHE_SOURCE_MAPPING[input.niche] || [];

        if (existingMapping.length > 0) {
          await db
            .update(nicheMappings)
            .set({ leadSources: JSON.stringify(sources) })
            .where(eq(nicheMappings.niche, input.niche));
        } else {
          await db.insert(nicheMappings).values({
            niche: input.niche,
            leadSources: JSON.stringify(sources),
            description: `Lead sources for ${input.niche}`,
          });
        }

        return {
          success: true,
          partnerId,
          leadsGenerated: sampleLeads.length,
          niche: input.niche,
        };
      } catch (error) {
        console.error("Error generating leads:", error);
        throw error;
      }
    }),

  /**
   * Get today's hot leads (highest qualification scores)
   */
  getTodaysHotLeads: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    try {
      // Get partner for this user
      const partnerResult = await db
        .select()
        .from(partners)
        .where(eq(partners.userId, ctx.user.id))
        .limit(1);

      if (partnerResult.length === 0) {
        return [];
      }

      const partner = partnerResult[0];

      // Get leads for this partner
      const hotLeads = await db
        .select()
        .from(leads)
        .where(eq(leads.partnerId, partner.id));

      // Sort by qualification score and return top 5
      return hotLeads
        .sort((a: any, b: any) => (b.qualificationScore || 0) - (a.qualificationScore || 0))
        .slice(0, 5);
    } catch (error) {
      console.error("Error getting leads:", error);
      return [];
    }
  }),

  /**
   * Get partner profile
   */
  getPartnerProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    try {
      const partnerResult = await db
        .select()
        .from(partners)
        .where(eq(partners.userId, ctx.user.id))
        .limit(1);

      return partnerResult.length > 0 ? partnerResult[0] : null;
    } catch (error) {
      console.error("Error getting partner profile:", error);
      return null;
    }
  }),

  /**
   * Update partner niche
   */
  updatePartnerNiche: protectedProcedure
    .input(z.object({ niche: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        let partner = await db
          .select()
          .from(partners)
          .where(eq(partners.userId, ctx.user.id))
          .limit(1);

        if (partner.length === 0) {
          await db.insert(partners).values({
            userId: ctx.user.id,
            businessName: "My Business",
            niche: input.niche,
            email: ctx.user.email || "",
          });
          return { success: true, niche: input.niche };
        }

        await db
          .update(partners)
          .set({ niche: input.niche })
          .where(eq(partners.id, partner[0].id));

        return { success: true, niche: input.niche };
      } catch (error) {
        console.error("Error updating partner niche:", error);
        throw error;
      }
    }),
});
