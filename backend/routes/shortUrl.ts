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
const router = express.Router();

router.post("/register", register); //register a new user
router.post("/login", loginUser); //login a user
router.post(
  "/createUrl",
  limiter,
  verifyTokenFromCookie,
  validateUrl,
  createUrl
); //shorten a url
router.get("/shortUrl", limiter, getAllUrl); // Get a particular short URL
router.get("/shortUrl/:id", handleRedirect, getUrl); //Get all URLs
router.delete("/shortUrl/:id", deleteUrl); // Delete a URL
router.get("/generate-qr/:url", generateQrCodeController); //Generate QR-code
router.get("/analytics/:id", analyticsMiddleware); //Analytics
// router.get("/linkhistory", linkHistoryMiddleware);
export default router;
