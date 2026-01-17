import { Router } from "express";
import {
  // addemployeeProfile,
  createStaff,
  deleteEmployeeById,
  employeeLogin,
  getAllEmployee,
  getEmployeeProfile,
  me,
} from "../controllers/employee.controller";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../config/upload";
// import { createStaff, getAllStaff } from "../controllers/user.controller";

const employeeRoute = Router();


// StaffRoute.post("/createStaff", authMiddleware, createStaff);
// StaffRoute.post("/staffLogin", staffLogin);
// StaffRoute.patch("/staffStatusUpdate/:id", authMiddleware, staffStatusUpdate);
// StaffRoute.delete("/staffDelete/:id", authMiddleware, deleteStaff);

// create new employee 
// employeeRoute.post(
//   "/createEmployee",
//   upload.fields([
//     { name: "aadhaarCard", maxCount: 1 },
//     { name: "photo", maxCount: 1 },
//     { name: "tenthMarksheet", maxCount: 1 },
//     { name: "twelfthMarksheet", maxCount: 1 },
//     { name: "degree", maxCount: 1 },
//     { name: "masterDegree", maxCount: 1 },
//     { name: "experienceLetter", maxCount: 1 },
//     { name: "salarySlip", maxCount: 1 },
//   ]),
//   createStaff
// );



employeeRoute.post("/createEmployee", authMiddleware, upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "marksheet10", maxCount: 1 },
  { name: "marksheet12", maxCount: 1 },
  { name: "masters", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "expLetter", maxCount: 1 },
  { name: "salarySlip", maxCount: 1 },
]), createStaff)
//login api
employeeRoute.post("/employeeLogin", employeeLogin);

employeeRoute.get("/getEmployee", getAllEmployee);

// get user details 
employeeRoute.get("/me", authMiddleware, me)

// employeeRoute.post("/addEmployeeProfile/:id", authMiddleware, upload.fields([
//   { name: "photo", maxCount: 1 },
//   { name: "aadhar", maxCount: 1 },
//   { name: "pan", maxCount: 1 },
//   { name: "marksheet10", maxCount: 1 },
//   { name: "marksheet12", maxCount: 1 },
//   { name: "masters", maxCount: 1 },
//   { name: "resume", maxCount: 1 },
//   { name: "expLetter", maxCount: 1 },
//   { name: "salarySlip", maxCount: 1 },
// ]), addemployeeProfile)

employeeRoute.get("/getProfile/:id", authMiddleware, getEmployeeProfile)
employeeRoute.delete("/deletEmployee/:id", authMiddleware, deleteEmployeeById)

export default employeeRoute;
