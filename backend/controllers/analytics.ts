import { Request, Response, NextFunction } from "express";
import { urlModel } from "../model/shortUrl";
import client from "../middleware/redis";

const ITEMS_PER_PAGE = 10; // Number of items per page

export async function analyticsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const shortCode = req.params.id;
  const userId = req.user?.id;
  const page = parseInt(req.query.page as string) || 1; // Current page number, default to 1 if not provided

  if (!shortCode) {
    return res.status(400).json({ message: "Missing 'short' query parameter" });
  }

  if (!userId) {
    // return res.status(401).json({ message: "Unauthorized! Please login." });
    return res.status(401).render("error", {
      errorMessage: "Error 401! Unauthorized! Please Login",
    });
  }

  try {
    const shortUrl = await urlModel.findOne({ shortUrl: shortCode });

    if (!shortUrl) {
      // return res.status(404).json({ message: "Short URL not found" });
      return res
        .status(404)
        .render("error", { errorMessage: "Error 404! Short URL not found" });
    }

    // Additional authorization check:
    if (shortUrl.user?.toString() !== userId) {
      // return res.status(403).json({ message: "Forbidden: Access denied" });
      return res.status(403).render("error", {
        errorMessage: "Error 403! Forbidden: Access Denied",
      });
    }

    // Calculate pagination skip value based on the current page
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Fetch paginated clickData based on skip and limit
    const paginatedClickData = shortUrl.clickData.slice(
      skip,
      skip + ITEMS_PER_PAGE
    );

    // Render the analytics page with paginated data
    res.render("viewanalytics", {
      id: shortCode,
      clickData: paginatedClickData,
      clicks: shortUrl.clicks,
      currentPage: page,
      totalPages: Math.ceil(shortUrl.clickData.length / ITEMS_PER_PAGE),
    });

    // Alternatively, return paginated data as JSON:
    // return res.json({ clickData: paginatedClickData, currentPage: page, totalPages: Math.ceil(shortUrl.clickData.length / ITEMS_PER_PAGE) });
  } catch (error) {
    // Handle database errors
    console.error(error);
    // return res.status(500).json({ message: "Internal server error" });
    res
      .status(500)
      .render("error", { errorMessage: "Error 500! Internal Server Error" });
  }
}
