import {
  registerUser,
  loginUser,
} from "./onboarding.service.js";

import {
  validateRegister,
  validateLogin,
} from "./onboarding.validation.js";

import { AppError } from "../../utils/AppError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { generateToken } from "../../utils/generatetokens.js";

export const register = async (req, res, next) => {
  try {
    const validation = validateRegister(req.body);

    if (!validation.isValid) {
      return next(new AppError(validation.message, 400));
    }

    const result = await registerUser(req.body);

    return res.status(201).json(new ApiResponse(201, result.message));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const login = async (req, res, next) => {
  try {
    const validation = validateLogin(req.body);

    if (!validation.isValid) {
      return next(new AppError(validation.message, 400));
    }

    const user = await loginUser(req.body);

    const token = generateToken({
      id: user.id,
    });

    res.cookie("auth", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json(new ApiResponse(200, "Login successful", { user: { id: user.id, name: user.name, email: user.email, role: user.role } }));
  } catch (error) {
    return next(new AppError(error.message, 401));
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("auth");

    return res.status(200).json(new ApiResponse(200, "Logout successful"));
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};