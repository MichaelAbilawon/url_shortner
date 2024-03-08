import { Request, Response, NextFunction } from "express";
import { urlModel } from "../model/shortUrl";

export async function analyticsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const shortUrl = req.params.id;
    const urlData = await urlModel.findOne({ shortUrl });

    if (!urlData) {
      // If the URL is not found in the database, send a 404 error
      return res.status(404).send("URL not found");
    }

    // Retrieve the click count for the URL
    const clicks = urlData.clickData;

    // Send the click count as the analytics data
    res.json({ clicks });
  } catch (error) {
    console.error("Error fetching analytics data", error);
    // Handle Error
    res.status(500).json({ error: "Internal server error" });
  }
}
