import { mysqlTable, int, timestamp,primaryKey } from "drizzle-orm/mysql-core";
import { categories } from "./categories.js";

export const categoryClosure = mysqlTable(
  "category_closure",
  {
    ancestorId: int("ancestor_id")
      .notNull()
      .references(() => categories.categoryId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    descendantId: int("descendant_id")
      .notNull()
      .references(() => categories.categoryId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    depth: int("depth").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.ancestorId, table.descendantId],
      name: "category_closure_ancestor_id_descendant_id",
    }),
  ]
);
