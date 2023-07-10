import { User } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

export function roleMiddleware(role: User["role"]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "Foydalanuvchi avtorizatsiyadan o'tmagan" });
      }
      const { role: userRole } = jwt.verify(token, config.secretKey) as User;
      const hasRole = role === userRole;
      if (!hasRole) {
        return res.status(403).json({ message: "Sizga ruxsat yo'q!" });
      }
      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "Foydalanuvchi avtorizatsiyadan o'tmagan" });
    }
  };
}
