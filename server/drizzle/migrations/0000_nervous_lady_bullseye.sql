CREATE TABLE `attributes` (
	`attribute_id` int AUTO_INCREMENT NOT NULL,
	`attribute_name` varchar(255) NOT NULL,
	`input_type` enum('text','number','select','multiselect','boolean','color','date') NOT NULL DEFAULT 'text',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attributes_attribute_id` PRIMARY KEY(`attribute_id`)
);
--> statement-breakpoint
CREATE TABLE `attribute_values` (
	`value_id` int AUTO_INCREMENT NOT NULL,
	`attribute_id` int NOT NULL,
	`value_text` varchar(255) NOT NULL,
	`unit_id` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attribute_values_value_id` PRIMARY KEY(`value_id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`category_id` int AUTO_INCREMENT NOT NULL,
	`category_name` varchar(255) NOT NULL,
	`category_description` text,
	`category_image` text,
	`category_url` text,
	`parent_id` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_category_id` PRIMARY KEY(`category_id`)
);
--> statement-breakpoint
CREATE TABLE `category_attribute_values` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category_id` int NOT NULL,
	`attribute_id` int NOT NULL,
	`value_id` int NOT NULL,
	`is_default_selected` tinyint DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cav_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `category_closure` (
	`ancestor_id` int NOT NULL,
	`descendant_id` int NOT NULL,
	`depth` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `category_closure_ancestor_id_descendant_id` PRIMARY KEY(`ancestor_id`,`descendant_id`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`department_id` int AUTO_INCREMENT NOT NULL,
	`department_name` varchar(100) NOT NULL,
	`is_active` tinyint DEFAULT 1,
	`department_description` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `departments_department_id` PRIMARY KEY(`department_id`),
	CONSTRAINT `department_name` UNIQUE(`department_name`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`role_id` int AUTO_INCREMENT NOT NULL,
	`role_name` varchar(100) NOT NULL,
	`is_active` tinyint DEFAULT 1,
	`role_description` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roles_role_id` PRIMARY KEY(`role_id`),
	CONSTRAINT `role_name` UNIQUE(`role_name`)
);
--> statement-breakpoint
CREATE TABLE `units` (
	`unit_id` int AUTO_INCREMENT NOT NULL,
	`unit_name` varchar(100) NOT NULL,
	`unit_abbreviation` varchar(50),
	`unit_symbol` varchar(20),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `units_unit_id` PRIMARY KEY(`unit_id`)
);
--> statement-breakpoint
ALTER TABLE `attribute_values` ADD CONSTRAINT `attribute_values_attribute_id_attributes_attribute_id_fk` FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`attribute_id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `attribute_values` ADD CONSTRAINT `attribute_values_unit_id_units_unit_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `units`(`unit_id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`category_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `category_attribute_values` ADD CONSTRAINT `cav_cat_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `category_attribute_values` ADD CONSTRAINT `cav_attr_fk` FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`attribute_id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `category_attribute_values` ADD CONSTRAINT `cav_val_fk` FOREIGN KEY (`value_id`) REFERENCES `attribute_values`(`value_id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `category_closure` ADD CONSTRAINT `category_closure_ancestor_id_categories_category_id_fk` FOREIGN KEY (`ancestor_id`) REFERENCES `categories`(`category_id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `category_closure` ADD CONSTRAINT `category_closure_descendant_id_categories_category_id_fk` FOREIGN KEY (`descendant_id`) REFERENCES `categories`(`category_id`) ON DELETE cascade ON UPDATE cascade;