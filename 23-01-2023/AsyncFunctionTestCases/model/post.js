const mongoose = require("../db/db");
const ObjectId = mongoose.Schema.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "Users" },
    title: String,
    description: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Posts", PostSchema);
