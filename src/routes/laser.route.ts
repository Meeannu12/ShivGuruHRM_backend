import { Router } from "express";
import { addNewLaser, deleteLaser, getAllEntryByName, getLasers, getNameByMonth } from "../controllers/laser.controller";


const laserRouter = Router()

laserRouter.post("/createLaser", addNewLaser)
laserRouter.get("/getLaser", getLasers)
laserRouter.delete("/deleteLaser/:id", deleteLaser)
laserRouter.get("/getNameByMonth", getNameByMonth)
laserRouter.get("/getAllEntryByName/:id", getAllEntryByName)



export default laserRouter