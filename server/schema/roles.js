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

export const roles = mysqlTable(
  "roles",
  {
    roleId: int("role_id").autoincrement().notNull(),
    roleName: varchar("role_name", { length: 100 }).notNull(),
    isActive: tinyint("is_active").default(1),
    roleDescription: text("role_description"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => [
    primaryKey({ columns: [table.roleId], name: "roles_role_id" }),
    unique("role_name").on(table.roleName),
  ]
);
