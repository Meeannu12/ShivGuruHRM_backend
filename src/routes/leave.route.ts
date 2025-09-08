import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { applyLeave, getAllLeaves } from "../controllers/leave.controller";

const leaveRoute = Router();

leaveRoute.post("/applyLeave", authMiddleware, applyLeave);
leaveRoute.get("/getAllLeaves", authMiddleware, getAllLeaves);

export default leaveRoute;
