import { NextFunction, Request, Response } from "express";

export function interceptErrors(
  error: Error,
  _request: Request,
  response: Response,
  next: NextFunction
) {
  response.json({
    status: "Error",
    message: error.message,
  });

  return next(error);
}
