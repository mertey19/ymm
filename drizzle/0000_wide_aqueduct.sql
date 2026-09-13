CREATE TABLE `administrators` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `administrators_user_id_unique` ON `administrators` (`user_id`);--> statement-breakpoint
CREATE TABLE `content` (
	`id` integer PRIMARY KEY NOT NULL,
	`document` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
