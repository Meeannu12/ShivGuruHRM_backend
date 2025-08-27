import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createProject } from "../controllers/project.controller";

const projectRoute = Router();

projectRoute.post("/createProject", authMiddleware, createProject);

export default projectRoute;
