import jsonwebtoken, { TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

//  Extend the Request interface with an optional user property
interface userPayLoad {
  id: string;
  email: string;
  iat: number;
  exp: number;
}
declare global {
  namespace Express {
    interface Request {
      user?: userPayLoad;
    }
  }
}

dotenv.config();

interface UserPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const verifyTokenFromCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tokenFromCookie = req.cookies?.token;

    if (!tokenFromCookie) {
      throw new Error("No token found.");
    }

    const decoded = jsonwebtoken.verify(
      tokenFromCookie,
      process.env.JWT_SECRET as string
    ) as UserPayload;

    req.user = decoded; // Attach the user to the request for future use

    next(); // Call next() to proceed to the next middleware
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.render("login");
      // res.status(401).json({ error: "Token expired" });
    } else {
      console.error("Token verification error: ", error);
      // res.status(401).json({ error: "Invalid Token" });
      res.status(401).render("error", { errorMessage: "Invalid Token" });
    }
  }
};
