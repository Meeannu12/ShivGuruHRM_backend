import { Router } from "express";
import {
  createStaff,
  employeeLogin,
  getAllEmployee,
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



employeeRoute.post("/createEmployee", createStaff)
//login api
employeeRoute.post("/employeeLogin", employeeLogin);

employeeRoute.get("/getEmployee", getAllEmployee);

export default employeeRoute;
