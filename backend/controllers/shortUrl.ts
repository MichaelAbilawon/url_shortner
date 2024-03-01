import express from "express";
import { nanoid } from "nanoid";
import { isUri } from "valid-url";
import { urlModel } from "../model/shortUrl";

export const createUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
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

    // Create the short URL
    const shortUrlData = {
      fullUrl,
      shortUrl: alias || nanoid().substring(0, 10),
    };
    const newShortUrl = await urlModel.create(shortUrlData);

    res.status(201).send(newShortUrl);
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .send({ message: "Something went wrong!", error: err.toString() });
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
    let shortUrl;
    // Check if the provided parameter is a valid URL
    if (isUri(req.params.id)) {
      //If it is a valid URL, search for it by the full URL
      shortUrl = await urlModel.findOne({ fullUrl: req.params.id });
    } else {
      //Otherwise, search for it by the short URL
      shortUrl = await urlModel.findOne({ shortUrl: req.params.id });
    }

    if (!shortUrl) {
      res.status(404).send({ message: "URL not Found!" });
    } else {
      // Increment the clicks counter and save the changes
      shortUrl.clicks++;
      await shortUrl.save();
      //Redirect to the original URL
      res.redirect(shortUrl.fullUrl);
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
