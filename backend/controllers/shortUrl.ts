import express from "express";
import { urlModel } from "../model/shortUrl";

export const createUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Get the original URL and shorten it if necessary
    let longURL = req.body.fullUrl;
    console.log("The fullUrl is ", longURL);
    const { fullUrl } = req.body;
    const urlFound = await urlModel.find({ fullUrl });
    if (urlFound.length > 0) {
      res.status(409);
      res.send(urlFound);
    } else {
      const shortUrl = await urlModel.create({ fullUrl });
      res.status(201).send(shortUrl);
    }
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
      res.status(404).send({ message: "Short Urls not found!" });
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
    const shortUrl = await urlModel.findOne({ shortUrl: req.params.id });
    if (!shortUrl) {
      res.status(404).send({ message: "Full Url not found!" });
    } else {
      shortUrl.clicks++;
      shortUrl.save();
      res.redirect(`${shortUrl.fullUrl}`);
    }
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .send({ message: "Something went wrong!", error: err.toString() });
  }
};
// export const getUrl = async (req: express.Request, res: express.Response) => {
//   try {
//     const shortUrl = await urlModel.findOne({ shortUrl: req.params.id });

//     // const shortUrl = await urlModel.findById(req.params.id);
//     if (shortUrl) {
//       res.status(200).send(shortUrl);
//     } else {
//       res.status(404).send({ message: "URL not found!" });
//     }
//   } catch (error) {
//     const err = error as Error;
//     res
//       .status(500)
//       .send({ message: "Something went wrong!", error: err.toString() });
//   }
// };

// export const deleteUrl = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const shortUrl = await urlModel.findByIdAndDelete({
//       _id: req.params.id,
//     });
//     if (shortUrl) {
//       res.status(200).send({ message: "Requested Url succesfully deleted!" });
//     }
//   } catch (error) {
//     const err = error as Error;
//     res
//       .status(500)
//       .send({ message: "Something went wrong!", error: err.toString() });
//   }
// };

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
