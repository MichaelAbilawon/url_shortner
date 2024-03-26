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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQrCodeController = void 0;
const qrCodeGenerator_1 = require("../middleware/qrCodeGenerator");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function generateQrCodeController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlToEncode = req.params.url;
        const size = req.query.size || "150x150"; // Default size is 150x150 if not provided
        if (!urlToEncode)
            return res.status(400).send({ error: "URL missing" });
        try {
            const qrCodeBase64 = yield (0, qrCodeGenerator_1.generateQrCode)(urlToEncode, size);
            // Set headers to indicate image content
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Content-Disposition", "inline; filename=qr-code.png");
            // Send the base64 encoded image data in the response
            res.send(Buffer.from(qrCodeBase64, "base64"));
        }
        catch (error) {
            console.error("Error generating QR code:", error);
            // res.status(500).json({ error: "Failed to generate QR code" });
            res
                .status(500)
                .render("error", { errorMessage: "Failed to generate QR code" });
        }
    });
}
exports.generateQrCodeController = generateQrCodeController;
