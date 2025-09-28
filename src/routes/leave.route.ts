import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { applyLeave, approveLeave, getAllLeaves, getAllLeavesByApprover, getAllLeaveStatus, rejectLeave } from "../controllers/leave.controller";

const leaveRoute = Router();

leaveRoute.post("/applyLeave", authMiddleware, applyLeave);
leaveRoute.get("/getAllLeaves", authMiddleware, getAllLeaves);
leaveRoute.get("/getAllLeavesByApprover", authMiddleware, getAllLeavesByApprover)
//
leaveRoute.post("/approveLeave/:id", authMiddleware, approveLeave)
leaveRoute.post("/rejectLeave/:id", authMiddleware, rejectLeave)


leaveRoute.get("/getAllLeaveStatus/:id", getAllLeaveStatus)

export default leaveRoute;
