import { Router } from "express";
import {
  createTask,
  getAssignedTasks,
  getTaskByStaff,
  updateTaskStatus,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth";

const taskRoute = Router();

taskRoute.post("/createTask", authMiddleware, createTask);
// get task by ceo, cfo of manager only
taskRoute.get("/getAssignedTasks", authMiddleware, getAssignedTasks);

taskRoute.get("/getTasksByStaff", authMiddleware, getTaskByStaff);

// update task status
taskRoute.post("/updateTaskStatus", authMiddleware, updateTaskStatus)

export default taskRoute;
