import { Router } from "express";

import {
  createReimbursement,
} from "./reimbursements.controller.js";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  authorize,
} from "../../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("EMP"),
  createReimbursement
);

export default router;