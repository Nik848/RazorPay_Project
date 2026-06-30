import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { db } from "./config/db.js";
import { sql } from "drizzle-orm";
import { errorHandler } from "./middleware/error.middleware.js";
import onboardingRoutes from "./modules/onboarding/onboarding.routes.js";
import rolesRoutes from "./modules/roles/roles.routes.js";
import employeesRoutes from "./modules/employees/employees.routes.js";
import reimbursementsRoutes from "./modules/reimbursements/reimbursements.routes.js";

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Change origin in production
app.use(express.json());
app.use(cookieParser());

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.status(200).json({ status: 'ok', message: 'Server is healthy and connected to the database' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});
app.use("/rest/roles", rolesRoutes);
app.use("/rest/employees", employeesRoutes);


app.use("/rest/onboardings", onboardingRoutes);

app.use(
  "/rest/reimbursements",
  reimbursementsRoutes
);

app.use(errorHandler);


export default app;
