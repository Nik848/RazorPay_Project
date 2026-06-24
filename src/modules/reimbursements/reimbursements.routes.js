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

import {
  updateReimbursement,
} from "./reimbursements.controller.js";

import {
  getReimbursements,
  getReimbursementsByUser,
} from "./reimbursements.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("EMP"),
  createReimbursement
);

router.patch(
  "/",
  authenticate,
  authorize(
    "RM",
    "APE",
    "CFO"
  ),
  updateReimbursement
);

router.get(
  "/",
  authenticate,
  getReimbursements
);

router.get(
  "/:userId",
  authenticate,
  authorize("RM"),
  getReimbursementsByUser
);

export default router;