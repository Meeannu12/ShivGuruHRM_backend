// import Counter from "../models/counter.js";

import EmployeeIdModel from "../models/employeeId.model";

async function getNextEmployeeId() {
  const counter = await EmployeeIdModel.findOneAndUpdate(
    { name: "employee" },        // fixed counter for employee
    { $inc: { seq: 1 } },        // increase by 1
    { new: true, upsert: true }  // create if not exist
  );

  // format: shivemp + 3 digit padded number
  return "shivemp" + counter.seq.toString().padStart(3, "0");
}

export default getNextEmployeeId;
