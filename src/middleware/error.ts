require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { DatabaseError } from "pg";

export const errorHandler = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(error);
  }

  if (process.env.NODE_ENV === "production") {
    console.log(error);
  }

  if (error instanceof DatabaseError) {
    return response
      .status(error.status || 400)
      .json({ message: "Something wrong" });
  }

  return response.status(error.status || 400).json({ message: error.message });
};
