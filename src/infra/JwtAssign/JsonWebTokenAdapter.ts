import jwt from "jsonwebtoken";
import IJwtAssign from "./IJwtAssign";

const secret =
  process.env.NODE_ENV === "production" ? process.env.JWT_SECRET || "" : "mys";

const refreshSecret =
  process.env.NODE_ENV === "production"
    ? process.env.JWT_REFRESH_SECRET || ""
    : "refresh_secret";

export default class JsonWebTokenAdapter implements IJwtAssign {
  decrypt(token: string): {
    id: number;
    access_level: string;
    enterprise_Id: number;
  } {
    const decrypted = jwt.verify(token, secret);
    const { data } = decrypted as {
      exp: number;
      data: { id: number; access_level: string; enterprise_Id: number };
      iat: number;
    };
    return data;
  }

  generate(data: any): string {
    const token = jwt.sign(
      {
        data: data,
      },
      secret,
      { expiresIn: "7d" }
    );

    return token;
  }

  generateRefreshToken(data: any): string {
    const refreshToken = jwt.sign(
      {
        data: data,
        type: "refresh",
      },
      refreshSecret,
      { expiresIn: "7d" }
    );

    return refreshToken;
  }

  verify(token: string): boolean {
    try {
      jwt.verify(token, secret);
      return true;
    } catch (err) {
      return false;
    }
  }

  verifyRefreshToken(token: string): boolean {
    try {
      const decoded = jwt.verify(token, refreshSecret) as any;
      return decoded.type === "refresh";
    } catch (err) {
      return false;
    }
  }

  decryptRefreshToken(token: string): {
    id: number;
    access_level: string;
    enterprise_Id: number;
  } {
    const decrypted = jwt.verify(token, refreshSecret);
    const { data } = decrypted as {
      exp: number;
      data: { id: number; access_level: string; enterprise_Id: number };
      iat: number;
      type: string;
    };
    return data;
  }
}
