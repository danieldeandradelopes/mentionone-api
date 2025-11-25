import express from "express";
import Enterprise from "../../entities/Enterprise";

declare global {
  namespace Express {
    interface Request {
      user_id?: number;
      access_level: string;
      enterprise_Id: number;
      refreshToken?: any;
    }

    interface Response {
      sentry: any;
    }
  }
}
