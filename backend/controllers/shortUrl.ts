import express from "express";
import { nanoid } from "nanoid";
import { urlModel } from "../model/shortUrl";
import client, { isConnected } from "../middleware/redis";
import { historyModel } from "../model/linkHistory";

// Optional: Define a function to reconnect to Redis with better logging and error handling
async function reconnectToRedis() {
  try {
    await client.connect(); // Attempt reconnection
    console.log("Reconnected to Redis successfully");
  } catch (error) {
    console.error("Error reconnecting to Redis:", error);
    // Implement additional logic for handling reconnection failures (e.g., retry attempts with backoff)
  }
}

export const createUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Check Redis connection before proceeding (with potential reconnection)
    if (!isConnected) {
      console.warn(
        "Redis connection not established, attempting reconnection..."
      );
      await reconnectToRedis();
    } else {
      console.info("Connection to Redis successfully established"); //Log successful connection
    }

    const { fullUrl, alias } = req.body;

    // Check if the fullUrl already exists in the database
    const urlFound = await urlModel.findOne({ fullUrl });
    if (urlFound) {
      res.status(409).send({ message: "The URL has already been registered" });
      return;
    }

    // Check if the alias already exists in the database
    if (alias) {
      const existingAlias = await urlModel.findOne({ alias });
      if (existingAlias) {
        res.status(400).send({ message: "Alias is already in use!" });
        return;
      }
    }

    // Check if shortened URL already exists in cache
    const cachedURL = await client.get(alias);

    if (cachedURL) {
      return res.json({
        message: "URL already shortened",
        shortUrlData: cachedURL,
      });
    } else {
      // Store shortened URL with original URL in cache
      await client.set(alias, req.body.fullUrl);

      // Set expiration time for cached data (optional)
      await client.expire(alias, 60 * 60); // Cache for 1 hour
    }

    // Create the short URL
    const shortUrlData = {
      fullUrl,
      shortUrl: alias || nanoid().substring(0, 10),
    };
    const newShortUrl = await urlModel.create(shortUrlData);
    // Insert record into link history database
    const linkHistoryData = {
      originalUrl: fullUrl, // Assuming fullUrl represents the original URL
      shortenedUrl: alias, // Assuming alias represents the shortened URL
      userId: req.user?.id,
    };
    await historyModel.create(linkHistoryData);

    res.status(201).send(newShortUrl);
  } catch (error) {
    const err = error as Error;
    console.error("Error creating short URL:", err); // Log detailed error with stack trace
    res
      .status(500)
      .send({ message: "Something went wrong!", error: err.message }); // Informative error message
  }
};

export const getAllUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrls = await urlModel.find();
    if (shortUrls.length < 0) {
      res.status(404).send({ message: "There are no Short Urls available!" });
    } else {
      res.status(200).send(shortUrls);
    }
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .send({ message: "Something went wrong!", error: err.toString() });
  }
};

export const getUrl = async (req: express.Request, res: express.Response) => {
  try {
    // let shortUrl;
    // // Check if the provided parameter is a valid URL
    // if (isUri(req.params.id)) {
    //   //If it is a valid URL, search for it by the full URL

    //   shortUrl = await urlModel.findOne({ fullUrl: req.params.id });
    // } else {
    //   //Otherwise, search for it by the short URL
    //   shortUrl = await urlModel.findOne({ shortUrl: req.params.id });
    // }

    // if (!shortUrl) {
    //   res.status(404).send({ message: "URL not Found!" });
    // } else {
    //   // Increment the clicks counter and save the changes
    //   shortUrl.clicks++;
    //   await shortUrl.save();
    //   //Redirect to the original URL
    //   res.redirect(shortUrl.fullUrl);
    // }
    const shortUrl = req.params.id;

    //Check if shortened URL already exists in cache
    const originalUrl = await client.get(shortUrl);

    if (originalUrl) {
      // Update click count
      await urlModel.findByIdAndUpdate(
        originalUrl,
        { shortUrl },
        { $inc: { clicks: 1 } }
      );
      return res.redirect(originalUrl);
    } else {
      const url = await urlModel.findById(shortUrl);
      if (!url) {
        return res.status(404).json({ message: "Short Url not found" });
      }

      //Store retrieved URL in cache
      await client.set(shortUrl, url.fullUrl);

      // Update click count
      await urlModel.findByIdAndUpdate(shortUrl, { $inc: { clicks: 1 } });

      return res.redirect(url.fullUrl);
    }
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .send({ message: "Something went wrong!", error: err.toString() });
  }
};

export const deleteUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrl = await urlModel.findByIdAndDelete(req.params.id);
    if (shortUrl) {
      res.status(200).send({ message: "Requested Url succesfully deleted!" });
    } else {
      res.status(404).send({ message: "URL not found!" });
    }
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .send({ message: "Something went wrong!", error: err.toString() });
  }
};
