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
exports.generateQrCode = void 0;
const axios_1 = __importDefault(require("axios"));
function generateQrCode(urlToEncode, size) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Encode the URL text
            const encodedUrl = encodeURIComponent(urlToEncode);
            console.log("Encoded URL:", encodedUrl); // Log the encoded URL
            // Construct the API URL with the encoded text and size parameters
            const apiUrl = `http://api.qrserver.com/v1/create-qr-code/?data=${encodedUrl}&size=${size}`;
            // Make the GET request to the API
            const response = yield axios_1.default.get(apiUrl, { responseType: "arraybuffer" });
            // Convert the response data to base64
            const qrCodeBase64 = Buffer.from(response.data, "binary").toString("base64");
            return qrCodeBase64; // Return base64 encoded image data
        }
        catch (error) {
            console.error("Error generating QR code:", error);
            throw error;
        }
    });
}
exports.generateQrCode = generateQrCode;
