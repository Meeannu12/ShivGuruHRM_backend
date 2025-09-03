import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createProject,
  getAllProject,
  submitProject,
} from "../controllers/project.controller";

const projectRoute = Router();

projectRoute.post("/createProject", authMiddleware, createProject);
projectRoute.get("/getAllProject", authMiddleware, getAllProject);
projectRoute.post("/submitProject", authMiddleware, submitProject)

export default projectRoute;
