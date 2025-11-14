import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createProject,
  deleteProject,
  getAllProject,
  submitProject,
} from "../controllers/project.controller";

const projectRoute = Router();

projectRoute.post("/createProject", authMiddleware, createProject);
projectRoute.get("/getAllProject", authMiddleware, getAllProject);
projectRoute.post("/submitProject", authMiddleware, submitProject)
projectRoute.delete("/deleteProject/:id", authMiddleware, deleteProject)


// create a complete project api 
// projectRoute.get("/getCompletedProject", authMiddleware, getCompletedProject)

export default projectRoute;
