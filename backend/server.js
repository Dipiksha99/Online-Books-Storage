const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// Routes
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const path = require("path");

app.use(
  "/images",
  express.static(path.join(__dirname, "../frontend/images"))
);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "test",
  })
  .then(() => {
    console.log("Connected to MongoDB");
    console.log("Database:", mongoose.connection.name);
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

// API routes
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Online Book Store API is running");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
