import express from "express";
import { validateUrl } from "../middleware/validateUrl";
import { handleRedirect } from "../middleware/shortUrl";
import {
  createUrl,
  getAllUrl,
  getUrl,
  deleteUrl,
} from "../controllers/shortUrl";
import { analyticsMiddleware } from "../controllers/analytics";
import { generateQrCodeController } from "../controllers/qrCodeController";
import register from "../middleware/register";
import { loginUser } from "../middleware/login";
import { verifyTokenFromCookie } from "../middleware/verifyToken";
import limiter from "../middleware/rate";
import { getLinkHistory } from "../middleware/history";
import { logoutHandler } from "../middleware/logout";
const router = express.Router();

router.post("/register", register); //register a new user
router.post("/login", loginUser); //login a user
router.post("/logout", logoutHandler); //logout a user
router.post(
  "/createUrl",
  limiter,
  verifyTokenFromCookie,
  validateUrl,
  createUrl
); //shorten a url
router.get("/shortUrl", limiter, getAllUrl); // Get all short URLs
router.get("/shortUrl/:id", limiter, handleRedirect, getUrl); //Get a URL
router.get(
  "/analytics/:id",
  limiter,
  verifyTokenFromCookie,
  analyticsMiddleware
); //Analytics
router.delete("/shortUrl/:id", limiter, verifyTokenFromCookie, deleteUrl); // Delete a URL
router.get("/generateqr/:url", limiter, generateQrCodeController); //Generate QR-code
router.get(
  "/analytics/:id",
  limiter,
  verifyTokenFromCookie,
  analyticsMiddleware
); //Analytics
router.get("/linkhistory", limiter, verifyTokenFromCookie, getLinkHistory); //get the link history of a specific user
export default router;

router.get("/login", (req, res) => {
  res.render("login");
}); //Login page
router.get("/", (req, res) => {
  res.render("homepage");
});
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
}); // dashboard
router.get("/logout", logoutHandler); // Logout

router.get("/createurl", (req, res) => {
  res.render("shortenurl");
}); //shorten a long url

router.get("/shortUrl/:id", (req, res) => {
  res.render("getUrl");
}); //Go to a site through the short url

router.get("/register", (req, res) => {
  res.render("register");
}); //Go to a site through the short url

router.get("/about", (req, res) => {
  res.render("about");
});
