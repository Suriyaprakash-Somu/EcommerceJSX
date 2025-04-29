import { mysqlTable, int, varchar, timestamp,primaryKey } from "drizzle-orm/mysql-core";

export const units = mysqlTable(
  "units",
  {
    unitId: int("unit_id").autoincrement().notNull(),
    unitName: varchar("unit_name", { length: 100 }).notNull(),
    unitAbbreviation: varchar("unit_abbreviation", { length: 50 }),
    unitSymbol: varchar("unit_symbol", { length: 20 }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => [
    primaryKey({ columns: [table.unitId], name: "units_unit_id" }),
  ]
);
