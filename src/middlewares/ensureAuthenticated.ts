import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      message: "authentication token is missing",
    });
  }

  const [, token] = authToken.split(" ");

  try {
    verify(token, process.env.SECRET_TOKEN_KEY!);

    return next();
  } catch (err) {
    return response.status(401).json({
      message: "invalid authentication token",
    });
  }
}
