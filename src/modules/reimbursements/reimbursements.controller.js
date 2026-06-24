import { ApiResponse } from "../../utils/ApiResponse.js";
import { AppError } from "../../utils/AppError.js";

import {
  validateCreateReimbursement,
} from "./reimbursements.validation.js";

import {
  createReimbursementService,
} from "./reimbursements.service.js";

import {
  validateUpdateReimbursement,
} from "./reimbursements.validation.js";

import {
  updateReimbursementService,
} from "./reimbursements.service.js";

import {
  getReimbursementsService,
  getReimbursementsByUserService,
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


export const updateReimbursement =
  async (
    req,
    res,
    next
  ) => {
    try {
      const validation =
        validateUpdateReimbursement(
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

      const {
        reimbursementId,
        status,
      } = req.body;

      const result =
        await updateReimbursementService(
          reimbursementId,
          status,
          req.user
        );

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            result.message
          )
        );
    } catch (error) {
      next(error);
    }
  };

export const getReimbursements = async (
  req,
  res,
  next
) => {
  try {
    const reimbursements =
      await getReimbursementsService(
        req.user
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Reimbursements fetched successfully",
        {
          reimbursements,
        }
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getReimbursementsByUser =
  async (
    req,
    res,
    next
  ) => {
    try {
      const employeeId = Number(
        req.params.userId
      );

      const reimbursements =
        await getReimbursementsByUserService(
          employeeId,
          req.user
        );

      return res.status(200).json(
        new ApiResponse(
          200,
          "Reimbursements fetched successfully",
          {
            reimbursements,
          }
        )
      );
    } catch (error) {
      next(error);
    }
  };

  