import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Stripe customer ID for this user */
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Partners table - stores partner business information and niche
 */
export const partners = mysqlTable("partners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  niche: varchar("niche", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  /** Stripe subscription ID */
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  /** Subscription status: active, past_due, canceled, unpaid */
  subscriptionStatus: varchar("subscriptionStatus", { length: 50 }).default("inactive"),
  /** Current pricing tier: basic, agency_partner, elite */
  pricingTier: varchar("pricingTier", { length: 50 }).default("basic"),
  /** Subscription start date */
  subscriptionStartDate: timestamp("subscriptionStartDate"),
  /** Subscription renewal date */
  subscriptionRenewalDate: timestamp("subscriptionRenewalDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

/**
 * Leads table - stores generated leads for partners
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  partnerId: int("partnerId").notNull(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  contactPerson: varchar("contactPerson", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  employees: int("employees"),
  niche: varchar("niche", { length: 255 }).notNull(),
  qualificationScore: int("qualificationScore").default(0),
  onlinePresence: text("onlinePresence"),
  notes: text("notes"),
  leadSource: varchar("leadSource", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Niche mappings - maps niches to their best lead sources
 */
export const nicheMappings = mysqlTable("nicheMappings", {
  id: int("id").autoincrement().primaryKey(),
  niche: varchar("niche", { length: 255 }).notNull().unique(),
  leadSources: text("leadSources"), // JSON array of sources
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NicheMapping = typeof nicheMappings.$inferSelect;
export type InsertNicheMapping = typeof nicheMappings.$inferInsert;

/**
 * Subscription table - tracks Stripe subscription events
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  partnerId: int("partnerId").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).notNull().unique(),
  stripePriceId: varchar("stripePriceId", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  canceledAt: timestamp("canceledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Relations for Drizzle ORM query API
 */
export const usersRelations = relations(users, ({ many }) => ({
  partners: many(partners),
}));

export const partnersRelations = relations(partners, ({ one, many }) => ({
  user: one(users, {
    fields: [partners.userId],
    references: [users.id],
  }),
  leads: many(leads),
  subscriptions: many(subscriptions),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  partner: one(partners, {
    fields: [leads.partnerId],
    references: [partners.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  partner: one(partners, {
    fields: [subscriptions.partnerId],
    references: [partners.id],
  }),
}));

/**
 * Audit Services - tracks admin audit service subscriptions
 */
export const auditServices = mysqlTable("auditServices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tier: mysqlEnum("tier", ["starter", "professional", "enterprise", "premium_plus"]).notNull(),
  monthlyPrice: int("monthlyPrice").notNull(),
  maxAuditsPerMonth: int("maxAuditsPerMonth").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AuditService = typeof auditServices.$inferSelect;
export type InsertAuditService = typeof auditServices.$inferInsert;

/**
 * Audits - tracks individual audits performed
 */
export const audits = mysqlTable("audits", {
  id: int("id").autoincrement().primaryKey(),
  auditServiceId: int("auditServiceId").notNull(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  businessAddress: varchar("businessAddress", { length: 500 }),
  googleMapsUrl: text("googleMapsUrl"),
  groundingScore: int("groundingScore"),
  hallucinations: text("hallucinations"),
  reportUrl: text("reportUrl"),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Audit = typeof audits.$inferSelect;
export type InsertAudit = typeof audits.$inferInsert;

/**
 * Relations for audit tables
 */
export const auditServicesRelations = relations(auditServices, ({ one, many }) => ({
  user: one(users, {
    fields: [auditServices.userId],
    references: [users.id],
  }),
  audits: many(audits),
}));

export const auditsRelations = relations(audits, ({ one }) => ({
  auditService: one(auditServices, {
    fields: [audits.auditServiceId],
    references: [auditServices.id],
  }),
}));
