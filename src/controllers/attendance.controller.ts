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
    }).sort({ date: 1 }).populate("userId")

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
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const date = ymd()

    // ✅ Always use IST date
    const now = new Date();
    const istDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    // ✅ Day boundaries
    const startOfDay = new Date(istDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(istDate);
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ Check existing
    const existing = await Attendance.findOne({
      userId,
      date,
    });

    if (existing && existing.checkIn)
      return res.status(400).json({ message: "Already checked in" });

    // ✅ Status calculate
    const hours = istDate.getHours();
    const minutes = istDate.getMinutes();

    let status: TAttendanceStatus = "absent"; // default
    if ((hours === 9 && minutes >= 58) || (hours === 10 && minutes <= 30)) {
      status = "present";
    } else if (
      (hours === 10 && minutes > 30) ||
      (hours >= 11 && hours < 13) ||
      (hours === 13 && minutes <= 30)
    ) {
      status = "half-day";
    }

    if (existing) {
      existing.checkIn = istDate;
      existing.status = status;
      await existing.save();
      return res.json(existing);
    }

    // ✅ Save new doc
    const doc = await Attendance.create({
      userId,
      date,
      checkIn: istDate,
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
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // ✅ Always use IST time
    const now = new Date();
    const istDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    const date = ymd()

    // ✅ Find today's attendance
    const existing = await Attendance.findOne({
      userId,
      date,
    });

    if (!existing || !existing.checkIn) {
      return res.status(400).json({ message: "No check-in found" });
    }
    if (existing.checkOut) {
      return res.status(400).json({ message: "Already checked out" });
    }

    // ✅ Save IST checkout time
    existing.checkOut = istDate;

    // ✅ Calculate hours
    const diffMs = existing.checkOut.getTime() - existing.checkIn!.getTime();
    existing.totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;

    const doc = await existing.save();

    res.status(200).json({
      message: `${doc.name} checked out. Total working hours: ${doc.totalHours}`,
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
