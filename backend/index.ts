import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
// import { connect } from "http2";
import shortUrl from "./routes/shortUrl";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http";
const app = express();

// Load environment variables from .env file
dotenv.config();
const server = http.createServer(app);

// Configure server timeouts
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000; // 120 seconds
// Connect to MongoDB database using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to Database");
  } catch (err) {
    console.error(`Error connecting to database: ${err}`);
  }
}
connectToDatabase();

// Middleware and Routers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Allow cross-origin requests (for testing purposes)
app.use(cors());
// Set EJS as the view engine
app.set("view engine", "ejs");
// The directory where EJS files are located
app.set("views", path.join(__dirname, "views"));
// Routes
app.use("/shortUrl", shortUrl);
app.get("/", (req, res) => {
  res.render("homepage");
});
app.get("/generateqr", (req, res) => {
  res.render("qrcode");
});

app.listen(3001, () => console.log("listening on port 3001"));

export default app;
