import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  timestamp,
  primaryKey, // ← import this
} from "drizzle-orm/mysql-core";

export const attributes = mysqlTable(
  "attributes",
  {
    attributeId: int("attribute_id").autoincrement().notNull(),
    attributeName: varchar("attribute_name", { length: 255 }).notNull(),
    inputType: mysqlEnum("input_type", [
      "text",
      "number",
      "select",
      "multiselect",
      "boolean",
      "color",
      "date",
    ])
      .default("text")
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.attributeId],
      name: "attributes_attribute_id",
    }),
  ]
);
