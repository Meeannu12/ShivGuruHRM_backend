import { Router } from "express";
import { addAccessModule, addRoleModule, deleteRoleById, getAllAccessModel, getAllRole, updateRoleById } from "../controllers/accessRole.controller";
import { authMiddleware } from "../middleware/auth";



const accessRoute = Router()


accessRoute.post("/addAccessModel", addAccessModule)
accessRoute.get("/getAccessModel", getAllAccessModel)



accessRoute.post("/addRoleModel", authMiddleware, addRoleModule)
accessRoute.get("/getRoleModel", authMiddleware, getAllRole)
accessRoute.delete("/deleteRole/:id", authMiddleware, deleteRoleById)
accessRoute.put("/updateRole/:id", authMiddleware, updateRoleById)


export default accessRoute