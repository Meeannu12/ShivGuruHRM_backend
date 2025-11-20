import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import LeaveModel from "../models/leave.model";
import AttendanceModel from "../models/attendance.model";
import EmployeeModel from "../models/employee.model";
import HolidayModel from "../models/holiday.model";
import NotificationModel from "../models/notification.model";
import mongoose from "mongoose";

// apply leave request from employee to any
export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, type, reason } = req.body;

    const leave = await LeaveModel.create({
      employee: req.user.userId,
      type,
      reason,
      startDate,
      endDate,
      readBy: [req.user.userId], // 👈 yaha add kar diya
    });

    res.status(201).json({ success: true, message: "request Send successful" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get all apply leaves by user's
export const getAllLeaves = async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  try {
    // console.log("UserId", userId);
    const newLeave = await LeaveModel.find({ employee: userId })
    res.status(200).json({
      success: true,
      message: "get Apply Leave status",
      Leave: newLeave,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllLeavesByApprover = async (req: AuthRequest, res: Response) => {
  try {
    const newLeave = await LeaveModel.find({ status: "pending" }).populate("employee")


    // Unread count
    const unreadCount = await LeaveModel.countDocuments({
      readBy: { $ne: req.user.userId }, // jisme userId nahi hai
    })

    res.status(200).json({
      success: true,
      message: "get Leave with Pending status",
      Leave: newLeave,
      unreadCount
    });

  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message })
  }
}

// approve Leave's by depends on frontend
export const approveLeave = async (req: AuthRequest, res: Response) => {
  try {
    const { revertReason } = req.body
    // console.log("revert message", rejectLeave)
    const leave = await LeaveModel.findById(req.params.id)
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = "approved";
    leave.revertReason = revertReason
    leave.readBy = [req.user.userId]
    // agar pehle se exist na karta ho tabhi push karna
    // if (!leave.readBy.includes(req.user.userId)) {
    //   leave.readBy.push(req.user.userId);
    // }
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

    res.json({ success: true, message: "Leave Approve" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectLeave = async (req: AuthRequest, res: Response) => {
  const { revertReason } = req.body
  try {
    const leave = await LeaveModel.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.revertReason = revertReason
    leave.status = "rejected";
    leave.readBy = [req.user.userId]
    // if (!leave.readBy.includes(req.user.userId)) {
    //   leave.readBy.push(req.user.userId);
    // }
    await leave.save();

    res.json({ success: true, message: "Leave Rejected " });
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


export const getAllLeaveStatus = async (req: AuthRequest, res: Response) => {
  const userId = req.params.id
  const year = parseInt(req.query.year as string) || new Date().getFullYear(); // default to current year
  try {
    // Example: Get leave summary for a user
    const leaves = await LeaveModel.aggregate([
      {
        $match: {
          employee: new mongoose.Types.ObjectId(userId),
          status: "approved",
          startDate: { $gte: new Date(`${year}-01-01`) },
          endDate: { $lte: new Date(`${year}-12-31`) }
        }
      },
      {
        $group: {
          _id: "$type",
          totalLeaves: { $sum: 1 }, // ya duration nikalna ho to $sum: { $dateDiff ... }
        },
      },
    ]);

    res.status(200).json({ success: true, leaves })
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message })
  }
}

// export const getAllLeaveStatus = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.params.id;
//     const year = parseInt(req.query.year as string) || new Date().getFullYear();

//     const leaves = await LeaveModel.aggregate([
//       // 1️⃣ Filter by user and year
//       {
//         $match: {
//           employee: new mongoose.Types.ObjectId(userId),
//           status: "approved",
//           startDate: { $gte: new Date(`${year}-01-01`) },
//           endDate: { $lte: new Date(`${year}-12-31`) },
//         },
//       },
//       // 2️⃣ Project month from startDate
//       {
//         $project: {
//           month: { $month: "$startDate" }, // 1=Jan, 12=Dec
//           startDate: 1,
//           endDate: 1,
//         },
//       },
//       // 3️⃣ Group by month and calculate total days
//       {
//         $group: {
//           _id: "$month",
//           totalLeaves: {
//             $sum: {
//               $dateDiff: {
//                 startDate: "$startDate",
//                 endDate: "$endDate",
//                 unit: "day",
//               },
//             },
//           },
//         },
//       },
//       // 4️⃣ Sort by month
//       { $sort: { _id: 1 } },
//     ]);

//     res.status(200).json({ success: true, leaves });
//   } catch (error) {
//     res.status(500).json({ success: false, message: (error as Error).message });
//   }
// };
