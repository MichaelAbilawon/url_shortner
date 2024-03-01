import { Request, Response } from "express";
import { generateQrCode } from "../middleware/qrCodeGenerator";

export async function generateQrCodeController(req: Request, res: Response) {
  const urlToEncode = req.params.url;
  const size = (req.query.size as string) || "150x150"; // Default size is 150x150 if not provided

  if (!urlToEncode) return res.status(400).send({ error: "URL missing" });

  try {
    const qrCodeBase64 = await generateQrCode(urlToEncode, size);

    // Set headers to indicate image content
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "inline; filename=qr-code.png");

    // Send the base64 encoded image data in the response
    res.send(Buffer.from(qrCodeBase64, "base64"));
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
}
