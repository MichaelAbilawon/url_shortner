"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUrl = void 0;
const valid_url_1 = __importDefault(require("valid-url"));
const validateUrl = (req, res, next) => {
    // Extract the 'fullUrl' from the request body
    const { fullUrl } = req.body;
    // Check if the URL is valid
    if (!valid_url_1.default.isUri(fullUrl)) {
        // If not valid, send a response with a 400 status code
        // return res.status(400).json({ message: "Invalid URL" });
        return res.status(400).render("error", { errorMessage: "Invalid URL" });
    }
    // If the URL is valid, proceed to the next middleware or route handler
    next();
};
exports.validateUrl = validateUrl;
