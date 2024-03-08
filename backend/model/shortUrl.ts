import mongoose from "mongoose";
import { nanoid } from "nanoid";

const shortUrlSchema = new mongoose.Schema(
  {
    fullUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
      default: () => nanoid().substring(0, 10),
    },
    alias: {
      type: String,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    clickData: [
      {
        timestamp: { type: Date, default: Date.now },
        referrer: String,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const urlModel = mongoose.model("ShortUrl", shortUrlSchema);
