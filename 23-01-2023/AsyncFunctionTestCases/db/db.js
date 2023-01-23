const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose.createConnection("mongodb://localhost:27017/TempDb", (err) => {
  if (!err) {
    console.log("Successfully Connected to MongoDB");
  } else {
    console.log("Failed to Connect MongoDB  " + err);
  }
});

module.exports = { mongoose };
