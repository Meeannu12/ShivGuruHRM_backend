import { Router } from "express";
import { addAccessModule, addRoleModule, getAllAccessModel, getAllRole } from "../controllers/accessRole.controller";



const accessRoute = Router()


accessRoute.post("/addAccessModel", addAccessModule)
accessRoute.get("/getAccessModel", getAllAccessModel)



accessRoute.post("/addRoleModel", addRoleModule)
accessRoute.get("/getRoleModel", getAllRole)


export default accessRoute