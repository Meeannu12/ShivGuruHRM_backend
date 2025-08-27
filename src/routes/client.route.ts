import { Router } from "express";
import { addClient, getAllClient } from "../controllers/client.controller";
import { authMiddleware } from "../middleware/auth";

const clientRoute = Router();

clientRoute.post("/addClient", authMiddleware, addClient);
clientRoute.get("/AllClient", authMiddleware, getAllClient);

export default clientRoute;
