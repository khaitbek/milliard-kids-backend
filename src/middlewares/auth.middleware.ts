import jwt from "jsonwebtoken";
import config from "../config";
import type { Request, Response, NextFunction } from "express";

module.exports = function (req: Request, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "User avtorizatsiyadan o'tmagan" });
    }
    const decodedData = jwt.verify(token, config.secretKey);
    req.user = decodedData;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "User avtorizatsiyadan o'tmagan" });
  }
};
