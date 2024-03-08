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
import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

router.post("/register", register); //register a new user
router.post("/login", loginUser); //login a user
router.post("/createUrl", verifyToken, validateUrl, createUrl);
router.get("/shortUrl", getAllUrl);
router.get("/shortUrl/:id", handleRedirect, getUrl);
router.delete("/shortUrl/:id", deleteUrl);
router.get("/generate-qr/:url", generateQrCodeController);
router.get("/analytics/:id", analyticsMiddleware);
// router.get("/linkhistory", linkHistoryMiddleware);
export default router;
