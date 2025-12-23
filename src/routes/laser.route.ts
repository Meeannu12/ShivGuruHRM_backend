import { Router } from "express";
import { addNewLaser, getLasers } from "../controllers/laser.controller";


const laserRouter = Router()

laserRouter.post("/createLaser", addNewLaser)
laserRouter.get("/getLaser", getLasers)



export default laserRouter