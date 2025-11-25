import { NextFunction, Request, Response } from "express";

const BarberOrAdminValidate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    if (
      request.access_level !== "barber" &&
      request.access_level !== "admin" &&
      request.access_level !== "superadmin"
    )
      return response.status(401).json({ message: "Unauthorized!" });

    return next();
  } catch (error) {
    return response.status(401).json({ message: "Unauthorized!" });
  }
};

export default BarberOrAdminValidate;
