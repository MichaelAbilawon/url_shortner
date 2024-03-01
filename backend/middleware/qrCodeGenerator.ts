import axios from "axios";

export async function generateQrCode(
  urlToEncode: string,
  size: string
): Promise<string> {
  try {
    // Encode the URL text
    const encodedUrl = encodeURIComponent(urlToEncode);
    console.log("Encoded URL:", encodedUrl); // Log the encoded URL

    // Construct the API URL with the encoded text and size parameters
    const apiUrl = `http://api.qrserver.com/v1/create-qr-code/?data=${encodedUrl}&size=${size}`;

    // Make the GET request to the API
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    // Convert the response data to base64
    const qrCodeBase64 = Buffer.from(response.data, "binary").toString(
      "base64"
    );

    return qrCodeBase64; // Return base64 encoded image data
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}
