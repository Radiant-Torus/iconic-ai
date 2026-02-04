CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerId` int NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`contactPerson` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`employees` int,
	`niche` varchar(255) NOT NULL,
	`qualificationScore` int DEFAULT 0,
	`onlinePresence` text,
	`notes` text,
	`leadSource` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nicheMappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`niche` varchar(255) NOT NULL,
	`leadSources` text,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nicheMappings_id` PRIMARY KEY(`id`),
	CONSTRAINT `nicheMappings_niche_unique` UNIQUE(`niche`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`niche` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
