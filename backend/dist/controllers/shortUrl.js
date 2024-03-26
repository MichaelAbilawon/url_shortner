"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteUrl = exports.getUrl = exports.getAllUrl = exports.createUrl = void 0;
const nanoid_1 = require("nanoid");
const shortUrl_1 = require("../model/shortUrl");
const redis_1 = __importStar(require("../middleware/redis"));
const linkHistory_1 = require("../model/linkHistory");
// Optional: Define a function to reconnect to Redis with better logging and error handling
function reconnectToRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield redis_1.default.connect(); // Attempt reconnection
            console.log("Reconnected to Redis successfully");
        }
        catch (error) {
            console.error("Error reconnecting to Redis:", error);
            // Implement additional logic for handling reconnection failures (e.g., retry attempts with backoff)
        }
    });
}
const createUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Check Redis connection before proceeding (with potential reconnection)
        if (!redis_1.isConnected) {
            console.warn("Redis connection not established, attempting reconnection...");
            yield reconnectToRedis();
        }
        else {
            console.info("Connection to Redis successfully established"); //Log successful connection
        }
        const { fullUrl, alias } = req.body;
        // Check if the fullUrl already exists in the database
        const urlFound = yield shortUrl_1.urlModel.findOne({ fullUrl });
        if (urlFound) {
            res.status(409).send({ message: "The URL has already been registered" });
            return;
        }
        // Check if the alias already exists in the database
        if (alias) {
            const existingAlias = yield shortUrl_1.urlModel.findOne({ alias });
            if (existingAlias) {
                res.status(400).send({ message: "Alias is already in use!" });
                return;
            }
        }
        // Check if shortened URL already exists in cache
        const cachedURL = yield redis_1.default.get(fullUrl);
        if (cachedURL) {
            return res.json({
                message: "URL already shortened",
                shortUrlData: cachedURL,
            });
        }
        else {
            // Store shortened URL with original URL in cache
            yield redis_1.default.set(alias, req.body.fullUrl);
            // Set expiration time for cached data (optional)
            yield redis_1.default.expire(alias, 60 * 60 * 24 * 7); // Cache for 1 week
        }
        // Create the short URL
        let shortUrl;
        const linkShortUrl = alias || (0, nanoid_1.nanoid)().substring(0, 10);
        if (alias) {
            shortUrl = `https://scissors-brief.onrender.com/shorturl/shorturl/${alias}`;
        }
        else {
            shortUrl = `https://scissors-brief.onrender.com/shorturl/shorturl/${linkShortUrl}`;
        }
        // const shorturl =
        //   "localhost:3001/shorturl/shorturl/" + alias || nanoid().substring(0, 10);
        const shortUrlData = {
            fullUrl,
            shortUrl: alias || (0, nanoid_1.nanoid)().substring(0, 10),
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        };
        const newShortUrl = yield shortUrl_1.urlModel.create(shortUrlData);
        // Insert record into link history database
        const linkHistoryData = {
            originalUrl: fullUrl,
            shortenedUrl: "https://scissors-brief.onrender.com/shorturl/shorturl/" + linkShortUrl,
            userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
        };
        yield linkHistory_1.historyModel.create(linkHistoryData);
        res.render("urlcreated", { fullUrl, shortUrl });
        // res.status(201).send(newShortUrl);
    }
    catch (error) {
        const err = error;
        console.error("Error creating short URL:", err);
        // res
        //   .status(500)
        //   .send({ message: "Something went wrong!", error: err.message });
        res.status(500).render("error", { errorMessage: err.message });
    }
});
exports.createUrl = createUrl;
const getAllUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUrls = yield shortUrl_1.urlModel.find();
        if (shortUrls.length < 0) {
            res.status(404).send({ message: "There are no Short Urls available!" });
        }
        else {
            res.status(200).send(shortUrls);
        }
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .send({ message: "Something went wrong!", error: err.toString() });
    }
});
exports.getAllUrl = getAllUrl;
// export const getUrl = async (req: express.Request, res: express.Response) => {
//   try {
//     const shortUrl = req.params.id;
//     //Check if shortened URL already exists in cache
//     const originalUrl = await client.get(shortUrl);
//     if (originalUrl) {
//       // Update click count in cache
//       await urlModel.findByIdAndUpdate(
//         originalUrl,
//         { shortUrl },
//         { $inc: { clicks: 1 } }
//       );
//       return res.redirect(originalUrl);
//     } else {
//       const url = await urlModel.findById(shortUrl);
//       if (!url) {
//         return res.status(404).json({ message: "Short Url not found" });
//       }
//       //Store retrieved URL in cache
//       await client.set(shortUrl, url.fullUrl);
//       // Update click count
//       await urlModel.findByIdAndUpdate(shortUrl, { $inc: { clicks: 1 } });
//       return res.redirect(url.fullUrl);
//     }
//   } catch (error) {
//     const err = error as Error;
//     res
//       .status(500)
//       .send({ message: "Something went wrong!", error: err.toString() });
//   }
// };
const getUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUrl = req.params.id;
        // Check if shortened URL already exists in cache
        const originalUrl = yield redis_1.default.get(shortUrl);
        if (originalUrl) {
            // Update click count in cache
            yield redis_1.default.incr(`clicks:${shortUrl}`);
            // Update click count in the database
            const url = yield shortUrl_1.urlModel.findOneAndUpdate({ shortUrl }, { $inc: { clicks: 1 } }, { new: true });
            return res.redirect(originalUrl);
        }
        else {
            const url = yield shortUrl_1.urlModel.findOne({ shortUrl });
            if (!url) {
                return res.status(404).json({ message: "Short Url not found" });
            }
            // Store retrieved URL in cache
            yield redis_1.default.set(shortUrl, url.fullUrl);
            // Update click count in both cache and database
            yield Promise.all([
                redis_1.default.set(`clicks:${shortUrl}`, 1),
                shortUrl_1.urlModel.findOneAndUpdate({ shortUrl }, { $inc: { clicks: 1 } }, { new: true }),
            ]);
            return res.redirect(url.fullUrl);
        }
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .send({ message: "Something went wrong!", error: err.toString() });
    }
});
exports.getUrl = getUrl;
const deleteUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUrl = yield shortUrl_1.urlModel.findByIdAndDelete(req.params.id);
        if (shortUrl) {
            res.status(200).send({ message: "Requested Url succesfully deleted!" });
        }
        else {
            res.status(404).send({ message: "URL not found!" });
        }
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .send({ message: "Something went wrong!", error: err.toString() });
    }
});
exports.deleteUrl = deleteUrl;
