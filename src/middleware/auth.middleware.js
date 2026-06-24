import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "../config/db.js";
import { users } from "../schema/users.schema.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.auth;

    if (!token) {
      return next(
        new AppError("Authentication required", 401)
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

    if (!user) {
      return next(
        new AppError("User not found", 401)
      );
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return next(
      new AppError("Invalid or expired token", 401)
    );
  }
};