import { Router } from "express";
import {
  getPendingNoticeRequest,
  getResignStatus,
  servingNotice,
  updateEmployeeResign,
} from "../controllers/resignation.controller";
import { authMiddleware } from "../middleware/auth";

const serveNotice = Router();

serveNotice.post("/servingNotice", authMiddleware, servingNotice);
serveNotice.put(
  "/updateEmployeeResign/:id",
  authMiddleware,
  updateEmployeeResign
);
serveNotice.get(
  "/getPendingNoticeRequest",
  authMiddleware,
  getPendingNoticeRequest
);

serveNotice.get("/getResignStatus", authMiddleware, getResignStatus);

export default serveNotice;
