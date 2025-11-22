import { Response } from "express";
import TaskModel from "../models/task.model";
import { AuthRequest } from "../middleware/auth";

// POST /tasks
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, assignedTo, priority, deadline } = req.body;
    // console.log(req.user);
    const task = await TaskModel.create({
      title,
      description,
      assignedTo,
      priority,
      deadline,
      createdBy: req.user.userId, // logged-in manager
    });

    res.status(201).json({ success: true, task });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /tasks/assigned-by-me
export const getAssignedTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user.role;

    if (!["ceo", "cfo", "manager"].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: "Access denied You are not Authorize",
      });
    }

    const tasks = await TaskModel.find()
      .populate("createdBy", "name role email")
      .populate("assignedTo", "name role email")
      .sort({ deadline: -1 });

    res.json({ success: true, tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompletedTaskByEmployee = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { status } = req.query;

    const filter: any = { assignedTo: req.user.userId };
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ["submit", "completed"] }; // dono status
    }

    const tasks = await TaskModel.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ deadline: 1 });

    res.json({ success: true, tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /tasks/my-tasks?status=pending
export const getTaskByStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    const filter: any = { assignedTo: req.user.userId };
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ["pending", "in-progress"] }; // dono status
    }

    const tasks = await TaskModel.find(filter)
      .populate("createdBy", "name role email")
      .populate("assignedTo", "name role email")
      .sort({ deadline: 1 });


    // Unread count
    const unreadCount = await TaskModel.countDocuments({
      readBy: { $ne: req.user.userId }, // jisme userId nahi hai
    })

    res.json({ success: true, tasks, unreadCount });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /tasks/:id
export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, id } = req.body;

    // console.log("hhhhh", req.user, status);

    const task = await TaskModel.findOneAndUpdate(
      { _id: id, assignedTo: req.user.userId }, // only owner can update
      {
        $set: { status },
        $addToSet: { readBy: req.user.userId }, // 👈 id add hogi, duplicate avoid
      },
      { new: true }
    );

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res
      .status(201)
      .json({ success: true, message: `Task Status Is ${status}` });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /tasks/report?month=08&year=2025&userId=123
export const getTaskReport = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year, userId } = req.query;

    // const startDate = new Date(`${year}-${month}-01`);
    // const endDate = new Date(year, month, 0); // end of month

    // Convert to number (or fallback to current year/month if not provided)
    const yearNum = year ? Number(year) : new Date().getFullYear();
    const monthNum = month ? Number(month) : new Date().getMonth() + 1;

    // start of month
    const startDate = new Date(yearNum, monthNum - 1, 1);
    // end of month
    const endDate = new Date(yearNum, monthNum, 0);

    const filter: any = {
      createdAt: { $gte: startDate, $lte: endDate },
    };
    if (userId) filter.assignedTo = userId;

    const tasks = await TaskModel.find(filter);

    // Optional: group by status
    const report = {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };

    res.json({ success: true, report, tasks });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTaskStatusByCeo = async (req: AuthRequest, res: Response) => {
  try {
    const taskSummary = await TaskModel.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          totalTasks: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          employee: "$user.name",
          totalTasks: 1,
          pending: 1,
          inProgress: 1,
          completed: 1,
        },
      },
    ]);

    const getRunningTask = await TaskModel.countDocuments({ status: { $in: ["pending", "in-progress", "reAssign"] } })
    // console.log("response Data", taskSummary);
    res.status(200).json({
      success: true,
      message: "get All Task Report by Cro",
      tasks: taskSummary,
      runningTask: getRunningTask
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
