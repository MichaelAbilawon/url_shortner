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
exports.handleRedirect = void 0;
const shortUrl_1 = require("../model/shortUrl");
function handleRedirect(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Find the original URL from the database using the id from the request parameters
        const shortUrl = req.params.id;
        const urlData = yield shortUrl_1.urlModel.findOne({ shortUrl });
        //   const urlData = await urlModel.findById(req.params.id);
        if (!urlData) {
            // If the URL is not found in the database, send a 404 error
            return res.status(404).send("URL not found");
        }
        yield Promise.all([
            shortUrl_1.urlModel.findOneAndUpdate({ shortUrl }, { $inc: { clicks: 1 } }, { new: true }),
        ]);
        // Log the click data
        const clickData = {
            timestamp: new Date(),
            referrer: req.get("Referer") || "Direct",
        };
        // Push the click data to the clickData array and save the document
        urlData.clickData.push(clickData);
        yield urlData.save();
        // Redirect the user to the original URL
        res.redirect(urlData.fullUrl);
    });
}
exports.handleRedirect = handleRedirect;
