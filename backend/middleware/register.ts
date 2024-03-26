import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { userModel } from "../model/user";

export async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    const isExisting = await userModel.findOne({ email: req.body.email });
    if (isExisting) {
      // res.status(400).json({ error: "Email has already been used." });
      res
        .status(400)
        .render("error", { errorMessage: "Email has already been used." });
    } else if (!req.body.password) {
      res.status(400).json({ error: "Password is required" });
      res.status(400).render("error", { errorMessage: "Password is required" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new userModel({
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      res.render("successfulRegistration");
    }
  } catch (error) {
    console.error(error);
    // res.status(500).json({ error: "Internal server error" });
    res.status(500).render("error", { errorMessage: "Internal Server Error" });
  }
}

export default registerUser;
