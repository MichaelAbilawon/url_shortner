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
exports.getLinkHistory = void 0;
const linkHistory_1 = require("../model/linkHistory");
// Define the function to get link history with pagination
const getLinkHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
        const skip = (page - 1) * pageSize;
        const totalCount = yield linkHistory_1.historyModel.countDocuments({ userId });
        const totalPages = Math.ceil(totalCount / pageSize);
        const userLinkHistory = yield linkHistory_1.historyModel
            .find({ userId })
            .skip(skip)
            .limit(pageSize);
        // res
        //   .status(200)
        //   .json({ linkHistory: userLinkHistory, totalPages, currentPage: page });
        res.render("linkhistory", {
            linkHistory: userLinkHistory,
            totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        console.error("Error fetching link history:", error);
        // res.status(500).json({ error: "Internal Server Error" });
        res.status(500).render("error", { errorMessage: "Internal Server Error" });
    }
});
exports.getLinkHistory = getLinkHistory;
