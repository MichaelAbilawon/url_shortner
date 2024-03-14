import mongoose from "mongoose";

// Define the link history schema
const linkHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the User model
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  shortenedUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
});

// Export the model for use in other parts of the application
export const historyModel = mongoose.model("linkHistory", linkHistorySchema);
