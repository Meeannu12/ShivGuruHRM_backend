import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import NotificationModel from "../models/notification.model";

export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message } = req.body;

    // console.log(title, message, req.file?.filename)


    const data: any = {
      title,
      message,
      createdBy: req.user.userId,
    }

    if (req.file) data.image = req.file.filename

    const notification = await NotificationModel.create(data);
    res.status(201).json({ success: true, message: "Create new Notification" });
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await NotificationModel.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name employeeType");

    // Unread count
    const unreadCount = await NotificationModel.countDocuments({
      readBy: { $ne: req.user.userId }, // jisme userId nahi hai
    })
    res.status(200).json({ success: true, notifications, unreadCount }); // 👈 yaha se unread count jayega
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const MarkReadNotification = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  try {
    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      { $addToSet: { readBy: req.user.userId } }, // add only once
      { new: true }
    );
    res.status(200).json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteNotification = async (req: AuthRequest, res: Response) => {
  const id = req.params.id
  try {
    await NotificationModel.findByIdAndDelete(id)
    res.status(200).json({ success: false, message: "Announcement deleted successful" })
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message })
  }
}
