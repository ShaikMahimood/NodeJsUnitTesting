const mongoose = require("../db/db");

const UserSchema = new mongoose.Schema(
  {
    name: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Users", UserSchema);
