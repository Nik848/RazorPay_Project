import { pgTable, bigserial, bigint, varchar, text, decimal, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { reimbursementStatus } from "./reimbursement-status.schema.js";

export const reimbursements = pgTable("reimbursements", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  employeeId: bigint("employee_id", { mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  statusId: bigint("status_id", { mode: "number" })
    .notNull()
    .unique()
    .references(() => reimbursementStatus.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
