import { Request, Response, NextFunction } from "express";
import { urlModel } from "../model/shortUrl";
import client, { isConnected } from "../middleware/redis";

async function reconnectToRedis() {
  try {
    await client.connect(); // Attempt reconnection
    console.log("Reconnected to Redis successfully");
  } catch (error) {
    console.error("Error reconnecting to Redis:", error);
  }
}

export async function analyticsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const shortCode = req.params.id;
  const userId = req.user?.id;

  if (!shortCode) {
    return res.status(400).json({ message: "Missing 'short' query parameter" });
  }

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized! Please login." });
  }

  try {
    const shortUrl = await urlModel.findOne({ shortUrl: shortCode });

    if (!shortUrl) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Additional authorization check :
    if (shortUrl.user?.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    return res.json({ clicks: shortUrl.clicks });
  } catch (error) {
    // Handle database errors
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
