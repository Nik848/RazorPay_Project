import { ApiResponse } from "../../utils/ApiResponse.js";

import { assignRoleService } from "./roles.service.js";
import { validateAssignRole } from "./roles.validation.js";

export const assignRole = async (
  req,
  res,
  next
) => {
  try {
    const validation =
      validateAssignRole(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        status: "error",
        message: validation.message,
      });
    }

    const { userId, role } = req.body;

    const result =
      await assignRoleService(
        userId,
        role
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