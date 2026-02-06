CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerId` int NOT NULL,
	`stripeSubscriptionId` varchar(255) NOT NULL,
	`stripePriceId` varchar(255) NOT NULL,
	`status` varchar(50) NOT NULL,
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`canceledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
ALTER TABLE `partners` ADD `stripeSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `partners` ADD `subscriptionStatus` varchar(50) DEFAULT 'inactive';--> statement-breakpoint
ALTER TABLE `partners` ADD `pricingTier` varchar(50) DEFAULT 'basic';--> statement-breakpoint
ALTER TABLE `partners` ADD `subscriptionStartDate` timestamp;--> statement-breakpoint
ALTER TABLE `partners` ADD `subscriptionRenewalDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);