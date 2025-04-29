// schema/categoryAttributeValues.js
import {
  mysqlTable,
  int,
  tinyint,
  timestamp,
  primaryKey,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { categories } from "./categories.js";
import { attributes } from "./attributes.js";
import { attributeValues } from "./attributeValues.js";

export const categoryAttributeValues = mysqlTable(
  "category_attribute_values",
  {
    id: int("id").autoincrement().notNull(),
    categoryId: int("category_id").notNull(),
    attributeId: int("attribute_id").notNull(),
    valueId: int("value_id").notNull(),
    isDefaultSelected: tinyint("is_default_selected").default(0),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "cav_pk" }),
    foreignKey({
      name: "cav_cat_fk",
      columns: [table.categoryId],
      foreignColumns: [categories.categoryId],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    foreignKey({
      name: "cav_attr_fk",
      columns: [table.attributeId],
      foreignColumns: [attributes.attributeId],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    foreignKey({
      name: "cav_val_fk",
      columns: [table.valueId],
      foreignColumns: [attributeValues.valueId],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ]
);
