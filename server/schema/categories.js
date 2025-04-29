import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  primaryKey,
  foreignKey
} from "drizzle-orm/mysql-core";

export const categories = mysqlTable(
  "categories",
  {
    categoryId: int("category_id").autoincrement().notNull(),
    categoryName: varchar("category_name", { length: 255 }).notNull(),
    categoryDescription: text("category_description"),
    categoryImage: text("category_image"),
    categoryUrl: text("category_url"),
    parentId: int("parent_id"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.categoryId],
      name: "categories_category_id",
    }),
    foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.categoryId],
        name: "fk_categories_parent",
      })
      .onDelete("set null"),
  ]
);
