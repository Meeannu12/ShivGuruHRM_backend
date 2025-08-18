// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// const JWT_SECRET = "your_secret_key"; // .env me rakho

export interface AuthRequest extends Request {
  user?: any; // token se user info yaha store karenge
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer token"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided" });
  }

  try {
    // console.log("check Token:", process.env.JWT_SECRET, token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET?.trim() as string);
    req.user = decoded; // decoded data ko req.user me store kar liya
    next();
  } catch (error: any) {
    // return res.status(403).json({ message: "Invalid or expired token" });
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};
