import { Router } from "express";
import { upload } from "../config/upload";
import { createTrustBill, getTrustBill, trustDeleteById } from "../controllers/trustBill.controller";


const trustRoute = Router()

trustRoute.post("/trust", upload.single("image"), createTrustBill)
trustRoute.get("/trust", getTrustBill)
trustRoute.delete("/trust/:id", trustDeleteById)

export default trustRoute