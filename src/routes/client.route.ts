import { Router } from "express";
import {
  addClient,
  addClientEntry,
  deleteClient,
  getAllClient,
  getClientEntry,
} from "../controllers/client.controller";
import { authMiddleware } from "../middleware/auth";

const clientRoute = Router();

clientRoute.post("/addClient", authMiddleware, addClient);
clientRoute.get("/allClient", authMiddleware, getAllClient);
clientRoute.delete("/deleteClient/:id", authMiddleware, deleteClient)

// client history work here
clientRoute.post("/addClientEntry", authMiddleware, addClientEntry);

clientRoute.get("/getClientEntry", authMiddleware, getClientEntry);

export default clientRoute;
