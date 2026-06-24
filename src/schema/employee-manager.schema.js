import { pgTable, bigserial, bigint, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const employeeManagerMapping = pgTable("employee_manager_mapping", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  employeeId: bigint("employee_id", { mode: "number" })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  managerId: bigint("manager_id", { mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});
