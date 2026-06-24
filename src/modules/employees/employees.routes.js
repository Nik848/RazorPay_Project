import { Router } from "express";

import {
  assignEmployee,
  unassignEmployee,
} from "./employees.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

import { authorize } from "../../middleware/role.middleware.js";

const router = Router();

router.post(
  "/assign",
  authenticate,
  authorize("CFO"),
  assignEmployee
);

router.delete(
  "/assign",
  authenticate,
  authorize("CFO"),
  unassignEmployee
);

export default router;