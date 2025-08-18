import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  checkIn,
  checkOut,
  getAllStaffAttendance,
  getAttendancebyStaff,
  getMonthReport,
} from "../controllers/attendance.controller";

const attendanceRoute = Router();

attendanceRoute.get(
  "/getAttendancebyStaff",
  authMiddleware,
  getAttendancebyStaff
);
attendanceRoute.get("/checkin", authMiddleware, checkIn);
attendanceRoute.get("/checkout", authMiddleware, checkOut);
attendanceRoute.get("/report", authMiddleware, getMonthReport);
attendanceRoute.get(
  "/getAllStaffAttendance",
  authMiddleware,
  getAllStaffAttendance
);

attendanceRoute.get("/getMonthReport", authMiddleware, getMonthReport)

export default attendanceRoute;
