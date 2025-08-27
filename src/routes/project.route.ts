import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createProject,
  getAllProject,
} from "../controllers/project.controller";

const projectRoute = Router();

projectRoute.post("/createProject", authMiddleware, createProject);
projectRoute.get("/getAllProject", authMiddleware, getAllProject);

export default projectRoute;
