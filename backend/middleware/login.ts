import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../model/user";
import mongoose, { Document } from "mongoose";

interface userDocument extends Document {
  email: string;
  password: string;
  urls: mongoose.Schema.Types.ObjectId[];
}

export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    console.log("Login request received");

    // Check if user exists

    const user: userDocument | null = await userModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
    } else {
      // Check if password is correct
      const validPass: boolean = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!validPass) {
        res.status(400).json({ error: "Invalid email or password" });
      } else {
        // Generate JWT
        const token: string = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "7h",
          }
        );
        // Save the token to a cookie and send a response
        res.cookie("token", token, { httpOnly: true });
        // res.status(200).json({ message: "Login successful" });
        //Take the user to the dashboard
        res.render("dashboard", { user: user.email });

        console.log("Login successful");
      }
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
