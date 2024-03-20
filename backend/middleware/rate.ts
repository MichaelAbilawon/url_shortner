import rateLimit from "express-rate-limit";
import { RequestHandler } from "express";

// Define rate limiter middleware
const limiter: RequestHandler = rateLimit({
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

export default limiter;
