import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { applyLeave } from "../controllers/leave.controller";

const leaveRoute = Router();

leaveRoute.post("/applyLeave", authMiddleware, applyLeave);

export default leaveRoute;
