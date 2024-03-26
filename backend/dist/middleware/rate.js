"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Define rate limiter middleware
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5000, // Allow 10000 requests per hour for authenticated users
    keyGenerator: (req) => {
        const user = req.user;
        return user ? user.id : "anonymous" + req.ip;
    },
    statusCode: 429,
    message: "You have exceeded your request limit.",
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            error: "Too Many Requests",
            message: "Please wait a bit before trying again.",
        });
    },
});
exports.default = limiter;
