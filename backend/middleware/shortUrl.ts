import { Request, Response, NextFunction } from "express";
import { urlModel } from "../model/shortUrl";

export async function handleRedirect(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Find the original URL from the database using the id from the request parameters
  const shortUrl = req.params.id;
  const urlData = await urlModel.findOne({ shortUrl });

  //   const urlData = await urlModel.findById(req.params.id);

  if (!urlData) {
    // If the URL is not found in the database, send a 404 error
    return res.status(404).send("URL not found");
  }

  // Log the click data
  const clickData = {
    timestamp: new Date(),
    referrer: req.get("Referer") || "Direct",
  };
  // Push the click data to the clickData array and save the document
  urlData.clickData.push(clickData);
  await urlData.save();

  // Redirect the user to the original URL
  res.redirect(urlData.fullUrl);
}
