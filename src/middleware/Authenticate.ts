import { NextFunction, Request, Response } from "express";
import AuthenticationController from "../controllers/AuthenticationController";
import { container, Registry } from "../infra/ContainerRegistry";
import JsonWebTokenAdapter from "../infra/JwtAssign/JsonWebTokenAdapter";
import { admin } from "../utils/firebase";

const Authenticate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ message: "Unset token!" });
  }

  try {
    const jsonWebTokenAdapter = new JsonWebTokenAdapter();

    const [, token] = authHeader.split(" ");

    const result = jsonWebTokenAdapter.decrypt(token);

    request.user_id = result.id;
    request.access_level = result.access_level;

    if (result.access_level === "superadmin") {
      request.enterprise_Id = 1;
      return next();
    }

    request.enterprise_Id = result.enterprise_Id;

    return next();
  } catch (error) {
    try {
      try {
        const [, token] = authHeader.split(" ");

        const decodedFirebase = await admin.auth().verifyIdToken(token);

        const {
          email,
          name,
          avatar,
          enterpriseId,
          phone,
          provider,
          providerUid,
        } = request.body;

        if (!email || !name || !avatar) {
          throw new Error("Fill all inputs [email, name, avatar]");
        }

        const authControlller = container.get<AuthenticationController>(
          Registry.UserController
        );
        const auth = await authControlller.makeProviderLogin({
          avatar,
          email,
          name,
          phone: phone ?? "",
          provider,
          providerUid,
          enterpriseId,
        });

        if (!auth) {
          return response.status(401).json({ message: "Unauthorized!" });
        }

        request.enterprise_Id = enterpriseId;
        request.user_id = auth.user.id;
        request.access_level = auth.user.access_level;

        return next();
      } catch (error) {
        return response.status(401).json({ message: "Unauthorized!" });
      }
    } catch (error) {
      return response.status(401).json({ message: "Unauthorized!" });
    }
  }
};

export default Authenticate;
