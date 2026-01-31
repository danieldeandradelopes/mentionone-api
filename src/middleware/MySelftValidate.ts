import { NextFunction, Request, Response } from "express";
import JsonWebTokenAdapter from "../infra/JwtAssign/JsonWebTokenAdapter";

const MySelfValidate = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({ message: "Unset token!" });
    }

    const jsonWebTokenAdapter = new JsonWebTokenAdapter();

    const [, token] = authHeader.split(" ");

    const result = jsonWebTokenAdapter.decrypt(token);

    if (request.user_id !== result.id) {
      return response.status(401).json({ message: "Unauthorized!" });
    }

    return next();
  } catch (error) {
    return response.status(401).json({ message: "Unauthorized!" });
  }
};

export default MySelfValidate;
