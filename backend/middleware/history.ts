import { Request, Response } from "express";
import { historyModel } from "../model/linkHistory";

// Define the function to get link history with pagination
export const getLinkHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const pageSize = parseInt(req.query.pageSize as string) || 10; // Default page size

    const skip = (page - 1) * pageSize;

    const totalCount = await historyModel.countDocuments({ userId });
    const totalPages = Math.ceil(totalCount / pageSize);

    const userLinkHistory = await historyModel
      .find({ userId })
      .skip(skip)
      .limit(pageSize);

    // res
    //   .status(200)
    //   .json({ linkHistory: userLinkHistory, totalPages, currentPage: page });
    res.render("linkhistory", {
      linkHistory: userLinkHistory,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching link history:", error);
    // res.status(500).json({ error: "Internal Server Error" });
    res.status(500).render("error", { errorMessage: "Internal Server Error" });
  }
};
