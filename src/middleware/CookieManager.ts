import { Request, Response } from "express";

export class CookieManager {
  private static readonly REFRESH_TOKEN_COOKIE = "refreshToken";

  private static readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ em dev fica false
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const), // ✅ em prod precisa none para subdomínios
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    path: "/", // disponível em toda a API
  };

  static setRefreshToken(res: Response, refreshToken: string): void {
    res.cookie(this.REFRESH_TOKEN_COOKIE, refreshToken, this.COOKIE_OPTIONS);
  }

  static getRefreshToken(req: Request): string | undefined {
    return req.cookies?.[this.REFRESH_TOKEN_COOKIE];
  }

  static clearRefreshToken(res: Response): void {
    res.clearCookie(this.REFRESH_TOKEN_COOKIE, {
      ...this.COOKIE_OPTIONS,
      maxAge: 0, // força expiração
    });
  }
}
