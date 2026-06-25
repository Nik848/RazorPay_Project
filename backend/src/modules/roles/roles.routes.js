import { Router } from "express";

import { assignRole } from "./roles.controller.js";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  authorize,
} from "../../middleware/role.middleware.js";

const router = Router();

router.post(
  "/assign",
  authenticate,
  authorize("CFO"),
  assignRole
);

export default router;