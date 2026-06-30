import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
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
