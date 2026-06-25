import { pgTable, bigserial, varchar, text, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => ({
  roleCheck: check("role_check", sql`${table.role} IN ('EMP', 'RM', 'APE', 'CFO')`),
}));
