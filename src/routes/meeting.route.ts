import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createMeeting, deleteMeet } from "../controllers/meeting.controller";


const meetRouter = Router()



meetRouter.post("/create_meet", authMiddleware, createMeeting)
meetRouter.get("/get_meet", authMiddleware, createMeeting)
meetRouter.delete("/delete_meet/:id", authMiddleware, deleteMeet)

export default meetRouter