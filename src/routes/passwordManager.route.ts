import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { addPasswordManager, deletePasswordCredential, getPasswordCredential, updatePasswordCredential } from "../controllers/passwordManager.controller";

const passwordRoute = Router()

passwordRoute.post("/addPassword", authMiddleware, addPasswordManager)

passwordRoute.get("/getPasswords", authMiddleware, getPasswordCredential)

passwordRoute.put("/updatePassword/:id", authMiddleware, updatePasswordCredential)

passwordRoute.delete("/deletePassword/:id", authMiddleware, deletePasswordCredential)



export default passwordRoute

