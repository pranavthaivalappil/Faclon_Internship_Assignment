

require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server is running ");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
})

  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });



