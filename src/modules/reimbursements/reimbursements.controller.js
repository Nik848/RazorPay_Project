import { ApiResponse } from "../../utils/ApiResponse.js";

import {
  validateCreateReimbursement,
} from "./reimbursements.validation.js";

import {
  createReimbursementService,
} from "./reimbursements.service.js";

export const createReimbursement =
  async (
    req,
    res,
    next
  ) => {
    try {
      const validation =
        validateCreateReimbursement(
          req.body
        );

      if (
        !validation.isValid
      ) {
        return res
          .status(400)
          .json({
            status: "error",
            message:
              validation.message,
          });
      }

      const reimbursement =
        await createReimbursementService(
          req.user.id,
          req.body
        );

      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            "Reimbursement created successfully",
            {
              reimbursement,
            }
          )
        );
    } catch (error) {
      next(error);
    }
  };