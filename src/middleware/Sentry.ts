require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";

export const SentryMiddleware = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(error);
  }

  response.statusCode = 500;
  response.end(response.sentry + "\n");

  return response.status(error.status || 400).json({ message: error.message });
};
