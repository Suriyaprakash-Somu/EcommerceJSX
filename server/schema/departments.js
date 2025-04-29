import {
  mysqlTable,
  int,
  varchar,
  tinyint,
  text,
  timestamp,
  primaryKey,
  unique,
} from "drizzle-orm/mysql-core";

export const departments = mysqlTable(
  "departments",
  {
    departmentId: int("department_id").autoincrement().notNull(),
    departmentName: varchar("department_name", { length: 100 }).notNull(),
    isActive: tinyint("is_active").default(1),
    departmentDescription: text("department_description"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.departmentId],
      name: "departments_department_id",
    }),
    unique("department_name").on(table.departmentName),
  ]
);
