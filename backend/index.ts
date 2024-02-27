import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

// Load environment variables from .env file
dotenv.config({ path: "./.env" });
dotenv.config();

// Allow cross-origin requests (for testing purposes)
app.use(cors());

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
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3001, () => console.log("listening on port 3001"));

export default app;