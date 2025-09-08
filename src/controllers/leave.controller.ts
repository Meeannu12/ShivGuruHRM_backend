import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import LeaveModel from "../models/leave.model";
import AttendanceModel from "../models/attendance.model";
import EmployeeModel from "../models/employee.model";
import HolidayModel from "../models/holiday.model";
import NotificationModel from "../models/notification.model";

// apply leave request from employee to any
export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, type, reason, approver } = req.body;

    const leave = await LeaveModel.create({
      employee: req.user.userId,
      approver,
      type,
      reason,
      startDate,
      endDate,
    });

    res.status(201).json({ success: true, message: "request Send successful" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllLeaves = async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  try {
    // console.log("UserId", userId);
    const newLeave = await LeaveModel.find({ employee: userId }).populate(
      "approver",
      "name"
    );
    res.status(200).json({
      success: true,
      message: "get Apply Leave status",
      Leave: newLeave,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveLeave = async (req: AuthRequest, res: Response) => {
  try {
    const leave = await LeaveModel.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = "approved";
    await leave.save();

    // Attendance update
    let current = new Date(leave.startDate);
    while (current <= leave.endDate) {
      await AttendanceModel.updateOne(
        { userId: leave.employee, date: current.toISOString().split("T")[0] },
        { $set: { status: "leave" } },
        { upsert: true }
      );
      current.setDate(current.getDate() + 1);
    }

    res.json({ success: true, leave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectLeave = async (req: AuthRequest, res: Response) => {
  try {
    const leave = await LeaveModel.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = "rejected";
    await leave.save();

    res.json({ success: true, leave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHoliday = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, date, isMandatoryLeave } = req.body;

    const holiday = await HolidayModel.create({
      title,
      date,
      isMandatoryLeave,
      createdBy: req.user.userId,
    });

    await NotificationModel.create({
      title,
      message,
      createdBy: req.user.userId,
    });

    // sab employees ke attendance update
    const users = await EmployeeModel.find();
    for (const user of users) {
      await AttendanceModel.updateOne(
        { userId: user._id, date: new Date(date).toISOString().split("T")[0] },
        { $set: { status: "leave", isHoliday: true } },
        { upsert: true }
      );
    }

    res.status(201).json({ success: true, holiday });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
