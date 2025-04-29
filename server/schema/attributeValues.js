import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  tinyint,
  primaryKey
} from "drizzle-orm/mysql-core";
import { attributes } from "./attributes.js";
import { units } from "./units.js";

export const attributeValues = mysqlTable(
  "attribute_values",
  {
    valueId: int("value_id").autoincrement().notNull(),
    attributeId: int("attribute_id")
      .notNull()
      .references(() => attributes.attributeId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    valueText: varchar("value_text", { length: 255 }).notNull(),
    unitId: int("unit_id").references(() => units.unitId, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.valueId],
      name: "attribute_values_value_id",
    }),
  ]
);
