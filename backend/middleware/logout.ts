// Logout route
import { Request, Response } from "express";

// Define route handler
export const logoutHandler = (req: Request, res: Response) => {
  // Clear user session or token
  res.clearCookie("token");

  // Redirect user to the home page
  res.redirect("/");
};
