import { Router } from "express";
import {
  createTask,
  deleteTaskById,
  getAssignedTasks,
  getCompletedTaskByEmployee,
  getTaskByStaff,
  getTaskStatusByCeo,
  updateTaskStatus,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth";

const taskRoute = Router();

taskRoute.post("/createTask", authMiddleware, createTask);
// get task by ceo, cfo of manager only
taskRoute.get("/getAssignedTasks", authMiddleware, getAssignedTasks);

taskRoute.get("/getTasksByStaff", authMiddleware, getTaskByStaff);

taskRoute.delete("/deleteTask/:id", authMiddleware, deleteTaskById)

taskRoute.get(
  "/getCompletedTaskByEmployee",
  authMiddleware,
  getCompletedTaskByEmployee
);

// update task status
taskRoute.post("/updateTaskStatus", authMiddleware, updateTaskStatus);

taskRoute.get("/getTaskStatusByCeo", authMiddleware, getTaskStatusByCeo);

export default taskRoute;
