import { Router } from "express";
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  staffLogin,
  staffStatusUpdate,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth";
// import { createStaff, getAllStaff } from "../controllers/user.controller";

const StaffRoute = Router();

StaffRoute.get("/getStaff", getAllStaff);
StaffRoute.post("/createStaff", createStaff);
StaffRoute.post("/staffLogin", staffLogin);
StaffRoute.patch("/staffStatusUpdate/:id", authMiddleware, staffStatusUpdate);
StaffRoute.delete("/staffDelete/:id", authMiddleware, deleteStaff);

export default StaffRoute;
