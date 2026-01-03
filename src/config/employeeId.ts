// // import Counter from "../models/counter.js";

import EmployeeAuthModel from "../models/employeeAuth.model";

// import EmployeeIdModel from "../models/employeeId.model";

// async function getNextEmployeeId() {
//   const counter = await EmployeeIdModel.findOneAndUpdate(
//     { name: "employee" },        // fixed counter for employee
//     { $inc: { seq: 1 } },        // increase by 1
//     { new: true, upsert: true }  // create if not exist
//   );

//   // format: shivemp + 3 digit padded number
//   return "shivemp" + counter.seq.toString().padStart(3, "0");
// }





async function generateEmployeeId() {
  const lastEmployee = await EmployeeAuthModel.findOne().sort({ createdAt: -1 });

  if (!lastEmployee || !lastEmployee.employeeId) {
    return "shivemp001";
  }

  // extract number part
  const lastNumber = parseInt(lastEmployee.employeeId.replace("shivemp", ""));
  const newNumber = lastNumber + 1;

  return "shivemp" + newNumber.toString().padStart(3, "0");
}


export default generateEmployeeId;