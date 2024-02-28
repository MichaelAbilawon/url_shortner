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
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const urlModel = mongoose.model("ShortUrl", shortUrlSchema);

// import mongoose from "mongoose";
// import { nanoid } from 'nanoid';

// // Define the schema using nanoid
// const shortUrlSchema = new mongoose.Schema(
//   {
//     fullUrl: {
//       type: String,
//       required: true,
//     },
//     shortUrl: {
//       type: String,
//       required: true,
//       default: async () => {
//         const { nanoid } = await import("nanoid");
//         return nanoid().substring(0, 10);
//       },
//     },
//     clicks: {
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Define and export the model
// export const urlModel = mongoose.model("ShortUrl", shortUrlSchema);
