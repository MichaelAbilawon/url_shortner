// Import necessary modules
import { Request, Response } from "express";
import { historyModel } from "../model/linkHistory";

// Define the function to get link history
export const getLinkHistory = async (req: Request, res: Response) => {
  try {
    // Get the user ID from the request
    const userId = req.user?.id;

    // Query the link history collection/table based on the user ID
    const userLinkHistory = await historyModel.find({ userId });

    // Respond with the user's link history
    res.status(200).json({ linkHistory: userLinkHistory });
  } catch (error) {
    // Handle errors
    console.error("Error fetching link history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
