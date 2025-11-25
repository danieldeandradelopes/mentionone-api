import { NextFunction, Request, Response } from "express";

const WebHookValidate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = request.headers.authorization;

    if (authorizationHeader) {
      const base64Credentials = authorizationHeader.split(" ")[1];

      const decodedCredentials = Buffer.from(
        base64Credentials,
        "base64"
      ).toString();

      if (decodedCredentials === process.env.WEBHOOK_TOKEN) {
        return next();
      }
    }
  } catch (error) {
    console.log(error);
    return response.status(401).json({ message: "Unauthorized!" });
  }
};

export default WebHookValidate;
