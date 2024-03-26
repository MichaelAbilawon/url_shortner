"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateUrl_1 = require("../middleware/validateUrl");
const redirect_1 = require("../middleware/redirect");
const shortUrl_1 = require("../controllers/shortUrl");
const analytics_1 = require("../controllers/analytics");
const qrCodeController_1 = require("../controllers/qrCodeController");
const register_1 = __importDefault(require("../middleware/register"));
const login_1 = require("../middleware/login");
const verifyToken_1 = require("../middleware/verifyToken");
const rate_1 = __importDefault(require("../middleware/rate"));
const history_1 = require("../middleware/history");
const logout_1 = require("../middleware/logout");
const router = express_1.default.Router();
router.post("/register", register_1.default); //register a new user
router.post("/login", login_1.loginUser); //login a user
router.post("/logout", logout_1.logoutHandler); //logout a user
router.post("/createUrl", rate_1.default, verifyToken_1.verifyTokenFromCookie, validateUrl_1.validateUrl, shortUrl_1.createUrl); //shorten a url
router.get("/shorturl", rate_1.default, shortUrl_1.getAllUrl); // Get all short URLs
router.get("/shorturl/:id", rate_1.default, redirect_1.handleRedirect, shortUrl_1.getUrl); //Go to a website via its short URL
router.get("/analytics/:id", rate_1.default, verifyToken_1.verifyTokenFromCookie, analytics_1.analyticsMiddleware); //Analytics
router.delete("/shorturl/:id", rate_1.default, verifyToken_1.verifyTokenFromCookie, shortUrl_1.deleteUrl); // Delete a short URL
router.get("/generateqr/:url", rate_1.default, qrCodeController_1.generateQrCodeController); //Generate QR-code
router.get("/linkhistory", rate_1.default, verifyToken_1.verifyTokenFromCookie, history_1.getLinkHistory); //get the link history of a specific user
exports.default = router;
router.get("/login", (req, res) => {
    res.render("login");
}); //Login page
router.get("/", (req, res) => {
    res.render("homepage");
});
router.get("/dashboard", (req, res) => {
    res.render("dashboard");
}); // dashboard
router.get("/logout", logout_1.logoutHandler); // Logout
router.get("/createurl", (req, res) => {
    res.render("shortenurl");
}); //shorten a long url
router.get("/geturl", (req, res) => {
    res.render("geturl");
}); //Go to a site through the short url
router.get("/register", (req, res) => {
    res.render("register");
}); //Register a new user
router.get("/about", (req, res) => {
    res.render("about");
}); // Go to the about page
router.get("/analytics", (req, res) => {
    res.render("getanalytics");
}); // Go to the analytics page
router.get("/linkhistory", (req, res) => {
    res.render("linkhistory");
}); // Go to the analytics page
