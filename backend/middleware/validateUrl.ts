import validUrl from "valid-url";
import { Request, Response, NextFunction } from "express";

export const validateUrlMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the 'fullUrl' from the request body
  const { fullUrl } = req.body;

  // Check if the URL is valid
  if (!validUrl.isUri(fullUrl)) {
    // If not valid, send a response with a 400 status code
    return res.status(400).json({ message: "Invalid URL" });
  }

  // If the URL is valid, proceed to the next middleware or route handler
  next();
};
