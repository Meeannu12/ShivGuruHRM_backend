import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createNotification,
  deleteNotification,
  getAllNotification,
  MarkReadNotification,
} from "../controllers/notification.controller";
import { upload } from "../config/upload";

const notificationRoute = Router();

notificationRoute.get(
  "/getAllNotification",
  authMiddleware,
  getAllNotification
);

notificationRoute.post(
  "/createNotification",
  authMiddleware, upload.single("image"),
  createNotification
);

notificationRoute.put(
  "/MarkReadNotification/:id",
  authMiddleware,
  MarkReadNotification
);

notificationRoute.delete("/deleteNotification/:id", authMiddleware, deleteNotification)

export default notificationRoute;
