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
    console.log(decoded);

    next(); // Call next() to proceed to the next middleware
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
    } else {
      console.error("Token verification error: ", error);
      res.status(401).json({ error: "Invalid Token" });
    }
  }
};

////////////////////////////////////////////////////////////////////////
// export const verifyToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader: string | undefined =
//     req.headers?.authorization?.split(" ")[1];
//   const tokenFromCookie: string | undefined = req.cookies?.token;

//   const token: string | undefined = authHeader || tokenFromCookie;
//   console.log("authHeader: ", authHeader, "tokenFromCookie: ", tokenFromCookie);

//   if (!token) return res.status(401).json({ msg: "No token found." });

//   try {
//     const decoded = jsonwebtoken.verify(
//       token,
//       process.env.JWT_SECRET as string
//     ) as userPayLoad;
//     console.log("decoded: ", decoded);

//     req.user = decoded; // Attach the user to the request for future use
//     next(); // Call next() to proceed to the next middleware
//   } catch (error) {
//     if (error instanceof jsonwebtoken.TokenExpiredError) {
//       return res.status(403).json({ message: "Token expired" });
//     }
//     console.error("Token verification error: ", error);
//     return res.status(403).json({ msg: "Invalid Token ", error: error });
//   }
// };

// export const verifyTokenFromCookie = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const tokenFromCookie = req.cookies?.token;

//   if (!tokenFromCookie) {
//     return res.status(401).json({ msg: "No token found." });
//   }

//   try {
//     const decoded = jsonwebtoken.verify(
//       tokenFromCookie,
//       process.env.JWT_SECRET as string
//     ) as userPayLoad;

//     req.user = decoded; // Attach the user to the request for future use
//     next(); // Call next() to proceed to the next middleware
//   } catch (error) {
//     if (error instanceof jsonwebtoken.TokenExpiredError) {
//       return res.status(403).json({ message: "Token expired" });
//     }
//     console.error("Token verification error: ", error);
//     return res.status(403).json({ msg: "Invalid Token ", error: error });
//   }
// };

// Extend the Request interface with an optional user property

// Extend the Request interface with an optional user property
