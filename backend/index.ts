import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

dotenv.config();

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Database is successfully connected");
  } catch (err) {
    console.error("Connection to the database failed:", err);
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
