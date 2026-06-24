import { ApiResponse } from "../../utils/ApiResponse.js";
import { AppError } from "../../utils/AppError.js";

import {
  validateAssignEmployee,
  validateUnassignEmployee,
} from "./employees.validation.js";

import {
  assignEmployeeService,
  unassignEmployeeService,
} from "./employees.service.js";

export const assignEmployee = async (
  req,
  res,
  next
) => {
  try {
    const validation =
      validateAssignEmployee(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        status: "error",
        message: validation.message,
      });
    }

    const { employeeId, managerId } =
      req.body;

    const result =
      await assignEmployeeService(
        employeeId,
        managerId
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        result.message
      )
    );
  } catch (error) {
    next(error);
  }
};

export const unassignEmployee = async (
  req,
  res,
  next
) => {
  try {
    const validation =
      validateUnassignEmployee(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        status: "error",
        message: validation.message,
      });
    }

    const { employeeId, managerId } =
      req.body;

    const result =
      await unassignEmployeeService(
        employeeId,
        managerId
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        result.message
      )
    );
  } catch (error) {
    next(error);
  }
};