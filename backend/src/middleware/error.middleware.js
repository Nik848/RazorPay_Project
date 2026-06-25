import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error isn't an instance of our AppError, we try to catch known errors
  if (!(error instanceof AppError)) {
    // Handle JWT Errors
    if (error.name === "JsonWebTokenError") {
      error = new AppError("Invalid token. Please log in again.", 401);
    } else if (error.name === "TokenExpiredError") {
      error = new AppError("Your token has expired! Please log in again.", 401);
    }
    // Handle PostgreSQL unique constraint violation (e.g., duplicate email)
    else if (error.code === "23505") {
      error = new AppError("Duplicate field value entered. Please use another value.", 400);
    } else {
      // Fallback for unknown programming errors
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? "Internal Server Error" : error.message;
      error = new AppError(message, statusCode);
    }
  }

  // Log the raw error for debugging purposes
  console.error("Error:", err);

  return res.status(error.statusCode).json({
    status: "error",
    message: error.message,
    // Optionally include stack trace only if we set NODE_ENV=development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};