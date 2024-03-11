import { Request, Response, NextFunction } from "express";
import { urlModel } from "../model/shortUrl";
import client from "../middleware/redis";

export async function analyticsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const shortUrl = req.params.id;
    // Check cache for click count
    const cachedClicks = await client.get(`clicks:${shortUrl}`);

    if (cachedClicks) {
      // Return cached click count if available
      return res.json({ clicks: parseInt(cachedClicks) });
    } else {
      const urlData = await urlModel.findOne({ shortUrl });
      if (!urlData) {
        // If the URL is not found in the database, send a 404 error
        return res.status(404).send("URL not found");
      }

      // Calculate total click count (optional for complex logic)
      const clicks = urlData.clickData.length;

      // Store total click count in cache
      await client.set(`clicks:${shortUrl}`, clicks);

      // Set expiration time for cached click count
      await client.expire(`clicks:${shortUrl}`, 60 * 60); //Cache for 1 hour

      return res.json({ clicks });
    }
  } catch (error) {
    console.error("Error fetching analytics data", error);
    // Handle Error
    res.status(500).json({ error: "Internal server error" });
  }
}
