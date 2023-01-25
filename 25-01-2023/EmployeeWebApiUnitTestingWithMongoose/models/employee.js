const mongoose = require("../db/db");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const EmployeeSchema = new mongoose.Schema(
  {
    empId: { type: Number, unique: true },
    name: { type: String },
    email: { type: String, unique: true },
    position: { type: String },
    office: { type: String },
    location: { type: String },
  },
  { versionKey: false }
);
EmployeeSchema.plugin(AutoIncrement, { inc_field: "empId" });

module.exports = mongoose.model("Employees", EmployeeSchema);
