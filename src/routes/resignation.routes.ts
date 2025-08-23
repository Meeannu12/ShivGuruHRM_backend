import { Router } from "express";
import {
  acceptResign,
  getPendingNoticeRequest,
  servingNotice,
} from "../controllers/resignation.controller";
import { authMiddleware } from "../middleware/auth";

const serveNotice = Router();

serveNotice.post("/servingNotice", authMiddleware, servingNotice);
serveNotice.put("/acceptResign/:id", authMiddleware, acceptResign);
serveNotice.get(
  "/getPendingNoticeRequest",
  authMiddleware,
  getPendingNoticeRequest
);

export default serveNotice;
