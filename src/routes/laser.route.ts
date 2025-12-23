import { Router } from "express";
import { addNewLaser, deleteLaser, getLasers } from "../controllers/laser.controller";


const laserRouter = Router()

laserRouter.post("/createLaser", addNewLaser)
laserRouter.get("/getLaser", getLasers)
laserRouter.delete("/deleteLaser/:id", deleteLaser)



export default laserRouter