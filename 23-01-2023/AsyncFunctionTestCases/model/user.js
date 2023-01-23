const { mongoose } = require("../db/db");

const UserSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model("Users", UserSchema);