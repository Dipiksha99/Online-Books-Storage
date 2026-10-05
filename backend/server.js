
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

mongoose.connect( process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("Error connecting to MongoDB", err);
});


const exp = require("express");
const bookRoutes = require("./routes/bookRoutes");

const app = exp();
app.use(exp.json());
app.use("/api/books", bookRoutes);
app.get("/",  (req, res) => {
  // Get books
//   const books = await books.find();
// console.log("Online Book Store API is running");
res.send("Online Book Store API is running");
//   res.json(books);
});
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});