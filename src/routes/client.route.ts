import { Router } from "express";
import {
  addClient,
  addClientEntry,
  getAllClient,
  getClientEntry,
} from "../controllers/client.controller";
import { authMiddleware } from "../middleware/auth";

const clientRoute = Router();

clientRoute.post("/addClient", authMiddleware, addClient);
clientRoute.get("/AllClient", authMiddleware, getAllClient);

// client history work here
clientRoute.post("/addClientEntry", authMiddleware, addClientEntry);

clientRoute.get("/getClientEntry", authMiddleware, getClientEntry);

export default clientRoute;
