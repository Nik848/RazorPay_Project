import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middleware/error.middleware.js";
import onboardingRoutes from "./modules/onboarding/onboarding.routes.js";
import rolesRoutes from "./modules/roles/roles.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/rest/roles", rolesRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server running",
  });
});

app.use("/rest/onboardings", onboardingRoutes);

app.use(errorHandler);

export default app;
