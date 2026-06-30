import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middleware/error.middleware.js";
import onboardingRoutes from "./modules/onboarding/onboarding.routes.js";
import rolesRoutes from "./modules/roles/roles.routes.js";
import employeesRoutes from "./modules/employees/employees.routes.js";
import reimbursementsRoutes from "./modules/reimbursements/reimbursements.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/rest/roles", rolesRoutes);
app.use("/rest/employees", employeesRoutes);


app.use("/rest/onboardings", onboardingRoutes);

app.use(
  "/rest/reimbursements",
  reimbursementsRoutes
);

app.use(errorHandler);

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Fallback for React Router (Single Page Application)
app.get(/^(.*)$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

export default app;
