// models/counter.js
import mongoose from "mongoose";

const employeeIdSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export default mongoose.model("EmployeeId", employeeIdSchema);
