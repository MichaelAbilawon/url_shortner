"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsMiddleware = void 0;
const shortUrl_1 = require("../model/shortUrl");
const ITEMS_PER_PAGE = 10; // Number of items per page
function analyticsMiddleware(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const shortCode = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
        if (!shortCode) {
            return res.status(400).json({ message: "Missing 'short' query parameter" });
        }
        if (!userId) {
            // return res.status(401).json({ message: "Unauthorized! Please login." });
            return res.status(401).render("error", {
                errorMessage: "Error 401! Unauthorized! Please Login",
            });
        }
        try {
            const shortUrl = yield shortUrl_1.urlModel.findOne({ shortUrl: shortCode });
            if (!shortUrl) {
                // return res.status(404).json({ message: "Short URL not found" });
                return res
                    .status(404)
                    .render("error", { errorMessage: "Error 404! Short URL not found" });
            }
            // Additional authorization check:
            if (((_b = shortUrl.user) === null || _b === void 0 ? void 0 : _b.toString()) !== userId) {
                // return res.status(403).json({ message: "Forbidden: Access denied" });
                return res.status(403).render("error", {
                    errorMessage: "Error 403! Forbidden: Access Denied",
                });
            }
            // Calculate pagination skip value based on the current page
            const skip = (page - 1) * ITEMS_PER_PAGE;
            // Fetch paginated clickData based on skip and limit
            const paginatedClickData = shortUrl.clickData.slice(skip, skip + ITEMS_PER_PAGE);
            // Render the analytics page with paginated data
            res.render("viewanalytics", {
                id: shortCode,
                clickData: paginatedClickData,
                clicks: shortUrl.clicks,
                currentPage: page,
                totalPages: Math.ceil(shortUrl.clickData.length / ITEMS_PER_PAGE),
            });
            // Alternatively, return paginated data as JSON:
            // return res.json({ clickData: paginatedClickData, currentPage: page, totalPages: Math.ceil(shortUrl.clickData.length / ITEMS_PER_PAGE) });
        }
        catch (error) {
            // Handle database errors
            console.error(error);
            // return res.status(500).json({ message: "Internal server error" });
            res
                .status(500)
                .render("error", { errorMessage: "Error 500! Internal Server Error" });
        }
    });
}
exports.analyticsMiddleware = analyticsMiddleware;
