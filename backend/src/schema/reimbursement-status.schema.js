import { pgTable, bigserial, varchar, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const reimbursementStatus = pgTable("reimbursement_status", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  rmStatus: varchar("rm_status", { length: 20 }).notNull().default("PENDING"),
  apeStatus: varchar("ape_status", { length: 20 }).notNull().default("PENDING"),
  cfoStatus: varchar("cfo_status", { length: 20 }).notNull().default("PENDING"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => ({
  rmCheck: check("rm_status_check", sql`${table.rmStatus} IN ('PENDING', 'APPROVED', 'REJECTED')`),
  apeCheck: check("ape_status_check", sql`${table.apeStatus} IN ('PENDING', 'APPROVED', 'REJECTED')`),
  cfoCheck: check("cfo_status_check", sql`${table.cfoStatus} IN ('PENDING', 'APPROVED', 'REJECTED')`),
}));
