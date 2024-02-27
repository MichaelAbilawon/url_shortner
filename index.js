const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

dotenv.config();

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is successfully connected");
  } catch (err) {
    console.error("Connection to the database failed:", err);
  }
}

connectToDatabase();

///Middleware and Routers
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get("/", (req, res) => {
  res.render("homepage");
});

app.listen(3001, () => console.log("listening on port 3001"));

module.exports = app;
