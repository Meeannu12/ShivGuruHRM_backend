import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createNotification,
  getAllNotification,
  MarkReadNotification,
} from "../controllers/notification.controller";

const notificationRoute = Router();

notificationRoute.get(
  "/getAllNotification",
  authMiddleware,
  getAllNotification
);

notificationRoute.post(
  "/createNotification",
  authMiddleware,
  createNotification
);

notificationRoute.put(
  "/MarkReadNotification/:id",
  authMiddleware,
  MarkReadNotification
);

export default notificationRoute;
