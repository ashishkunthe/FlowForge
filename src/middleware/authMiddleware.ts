import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface RequestExtend extends Request {
  userId: string;
}

export async function authMiddleware(
  req: RequestExtend,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "invalid token" });
    }

    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;
    if (!token) {
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
