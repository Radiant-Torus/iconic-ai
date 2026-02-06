CREATE TABLE `auditServices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('starter','professional','enterprise','premium_plus') NOT NULL,
	`monthlyPrice` int NOT NULL,
	`maxAuditsPerMonth` int NOT NULL,
	`stripeSubscriptionId` varchar(255),
	`status` varchar(50) DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auditServices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`auditServiceId` int NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`businessAddress` varchar(500),
	`googleMapsUrl` text,
	`groundingScore` int,
	`hallucinations` text,
	`reportUrl` text,
	`status` varchar(50) DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audits_id` PRIMARY KEY(`id`)
);
