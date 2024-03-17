import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { userModel } from "../model/user";

const router = Router();

export async function registerUser(
  req: Request,
  res: Response
): Promise<Response> {
  // Handles user registration
  try {
    const isExisting = await userModel.findOne({ email: req.body.email });
    if (isExisting) {
      return res.status(400).json({ error: "Email has already been used." });
    }
    if (!req.body.password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new userModel({
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    // const token = jsonwebtoken.sign(
    //   { id: newUser._id, email: newUser.email },
    //   process.env.JWT_SECRET as string,
    //   {
    //     expiresIn: "12h",
    //   }
    // );
    res.render("successfulRegistration");
    return res.status(201).json({ message: "New user created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// router.post("/register", registerUser);

export default router;

import client from "../middleware/redis"; // Assuming client is your Redis connection
