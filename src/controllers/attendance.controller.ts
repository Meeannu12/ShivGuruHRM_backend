import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import mongoose from "mongoose";
import Attendance from "../models/attendance.model";

type TAttendanceStatus = "present" | "absent" | "half-day" | "leave";

// helper to get YYYY-MM-DD in server timezone
const ymd = (d = new Date()) => d.toISOString().slice(0, 10);

export const getAttendancebyStaff = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-based (0 = Jan)
    const currentYear = now.getFullYear();

    // ✅ start and end of current month
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    // console.log(startDate, endDate, req.user.userId);

    const attendance = await Attendance.find({
      userId: req.user.userId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    res.status(200).json({
      message: "Attendance fetched successfully",
      // month: currentMonth + 1,
      // year: currentYear,
      attendance,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    // console.log("checkIN", user);
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // console.log("user data get from token", user);
    const date = ymd();
    const now = new Date();
    const existing = await Attendance.findOne({ userId, date });
    if (existing && existing.checkIn)
      return res.status(400).json({ message: "Already checked in" });

    // 🔹 Status calculate karo
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let status: TAttendanceStatus = "absent"; // default

    // Check 10:00 - 10:30
    if (
      hours === 10 &&
      minutes >= 0 &&
      minutes <= 30 // 10:00 - 10:30
    ) {
      status = "present";
    }
    // Check 10:31 - 13:30
    else if (
      (hours === 10 && minutes > 30) || // 10:31 - 10:59
      (hours >= 11 && hours < 13) || // 11:00 - 12:59
      (hours === 13 && minutes <= 30) // 13:00 - 13:30
    ) {
      status = "half-day";
    }

    if (existing) {
      existing.checkIn = now;
      existing.status = status; // 👈 update status
      await existing.save();
      return res.json(existing);
    }

    const doc = await Attendance.create({
      userId,
      date,
      checkIn: now,
      status,
      name: user.name,
      staffId: user.employeeId,
    });
    res.status(201).json({ message: `${doc.name} checkIn at ${doc.checkIn}` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    // const user = req.user;
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const date = ymd();
    const existing = await Attendance.findOne({ userId, date });
    if (!existing || !existing.checkIn)
      return res.status(400).json({ message: "No check-in found" });
    if (existing.checkOut)
      return res.status(400).json({ message: "Already checked out" });

    existing.checkOut = new Date();
    const diffMs = existing.checkOut.getTime() - existing.checkIn!.getTime();
    existing.totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // two decimals
    const doc = await existing.save();
    res.status(200).json({
      message: `${doc.name} CheckOut total working hour ${doc.totalHours}`,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// export const getMonthReport = async (req: Request, res: Response) => {
//   try {
//     const { userId, month, year } = req.query as any;
//     if (!userId || !month || !year)
//       return res.status(400).json({ message: "Missing params" });

//     const m = Number(month);
//     const y = Number(year);
//     const start = new Date(y, m - 1, 1);
//     const end = new Date(y, m, 1);

//     const rows = await Attendance.find({
//       userId,
//       date: {
//         $gte: start.toISOString().slice(0, 10),
//         $lt: end.toISOString().slice(0, 10),
//       },
//     });
//     const totalHours = rows.reduce((s, r) => s + (r.totalHours || 0), 0);
//     const presentDays = rows.filter((r) => r.checkIn).length;
//     res.json({ totalHours, presentDays, rows });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getMonthReport = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    const now = new Date();

    const currentMonth = month ? Number(month) - 1 : now.getMonth(); // Mongo ke liye 0-based
    const currentYear = year ? Number(year) : now.getFullYear();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const report = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
        },
      },
      {
        $group: {
          _id: "$userId",
          name: { $first: "$name" },
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: { $cond: [{ $ifNull: ["$checkIn", false] }, 1, 0] },
          },
          checkedOutDays: {
            $sum: { $cond: [{ $ifNull: ["$checkOut", false] }, 1, 0] },
          },
          totalWorkedHours: { $sum: { $ifNull: ["$totalHours", 0] } },
        },
      },
      {
        $addFields: {
          absentDays: { $subtract: ["$totalDays", "$presentDays"] },
          avgWorkedHours: {
            $cond: [
              { $gt: ["$presentDays", 0] },
              { $divide: ["$totalWorkedHours", "$presentDays"] },
              0,
            ],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      month: currentMonth + 1,
      year: currentYear,
      report,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllStaffAttendance = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // 🟢 Agar query me date aayi hai use karo, warna current date lo
    const dateParam = req.query.date
      ? new Date(req.query.date as string)
      : new Date();
    // console.log("get date from frontend", dateParam);
    // Start & End of that date
    const startOfDay = new Date(dateParam.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateParam.setHours(23, 59, 59, 999));

    // ✅ Attendance records on that date
    const attendanceRecords = await Attendance.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    // .populate("userId", "name email"); // staff ka naam dikhane ke liye

    // ✅ All staff list
    // const allStaff = await Attendance.find({}, "name email");

    // ✅ Map present users
    const presentUserIds = attendanceRecords.map((a) => a.userId.toString());

    // ✅ Absent users = allStaff - presentUsers
    // const absentUsers = allStaff.filter(
    //   (staff) => !presentUserIds.includes(staff._id.toString())
    // );

    res.status(200).json({
      message: "Get All Staff Attendance fetched successfully",
      date: startOfDay.toDateString(),
      present: attendanceRecords.length,
      attendanceRecords,
      // absent: absentUsers.length,
      // attendance: {
      //   present: attendanceRecords,
      //   absent: absentUsers,
      // },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
