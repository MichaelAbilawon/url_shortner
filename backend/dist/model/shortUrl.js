"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const nanoid_1 = require("nanoid");
const shortUrlSchema = new mongoose_1.default.Schema({
    fullUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        default: () => (0, nanoid_1.nanoid)().substring(0, 10),
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
}, {
    timestamps: true,
});
exports.urlModel = mongoose_1.default.model("ShortUrl", shortUrlSchema);
