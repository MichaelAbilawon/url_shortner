import express from "express";
import { validateUrlMiddleware } from "../middleware/validateUrl";

import {
  createUrl,
  getAllUrl,
  getUrl,
  deleteUrl,
} from "../controllers/shortUrl";
import { generateQrCodeController } from "../controllers/qrCodeController";

const router = express.Router();

router.post("/shortUrl", validateUrlMiddleware, createUrl);
router.get("/shortUrl", getAllUrl);
router.get("/shortUrl/:id", getUrl);
router.delete("/shortUrl/:id", deleteUrl);
router.get("/generate-qr/:url", generateQrCodeController);
export default router;
