import { NextFunction, Request, Response } from "express";
import JsonWebTokenAdapter from "../infra/JwtAssign/JsonWebTokenAdapter";

const Authenticate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("Authenticate");
  const authHeader = request.headers.authorization;

  console.log(authHeader, "authHeader");

  if (!authHeader) {
    return response.status(401).json({ message: "Unset token!" });
  }

  try {
    const jsonWebTokenAdapter = new JsonWebTokenAdapter();

    console.log(jsonWebTokenAdapter, "jsonWebTokenAdapter");

    const [, token] = authHeader.split(" ");

    const result = jsonWebTokenAdapter.decrypt(token);

    console.log(result, "result");

    request.user_id = result.id;
    request.access_level = result.access_level;

    if (result.access_level === "superadmin") {
      request.enterprise_id = 1;
      return next();
    }

    request.enterprise_id = result.enterprise_id;

    return next();
  } catch (error) {
    return response.status(401).json({ message: "Unauthorized!" });
  }
};

export default Authenticate;
