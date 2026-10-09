const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

mongoose.connect( process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("Error connecting to MongoDB", err);
});


const exp = require("express");
const cors = require("cors");

// ===== book router =====//
const bookRoutes = require("./routes/bookRoutes");

const app = exp();
app.use(cors());

app.use(exp.json());
app.use("/api/books", bookRoutes);
app.get("/",  (req, res) => {
  // Get books
//   const books = await books.find();
// console.log("Online Book Store API is running");
res.send("Online Book Store API is running");
//   res.json(books);
});


//  ===== user ke liye ===== //
const authRoutes = require ("./routes/authRoutes");
app.use("/api/auth", authRoutes);


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});