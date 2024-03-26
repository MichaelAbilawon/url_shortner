"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define the link history schema
const linkHistorySchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.historyModel = mongoose_1.default.model("linkHistory", linkHistorySchema);
