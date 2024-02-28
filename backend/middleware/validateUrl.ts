import validUrl from "valid-url";
import { Request, Response, NextFunction } from "express";

export const validateUrlMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullUrl } = req.body;

  if (!validUrl.isUri(fullUrl)) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  next();
};
