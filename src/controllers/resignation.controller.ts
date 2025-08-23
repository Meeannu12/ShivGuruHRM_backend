import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import ResignationModel from "../models/resignation.model";
import EmployeeModel from "../models/employee.model";

function getAfterFifteen(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 15); // add 15 days
  return date;
}

// const getAfterFifteen = (): Date => {
//   const date = new Date();
//   date.setDate(date.getDate() + 15); // add 15 days
//   return date; // same line
// };

export const servingNotice = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  try {
    const { reason } = req.body;
    if (!reason) {
      res
        .status(400)
        .json({ success: false, message: "reason must be required" });
      return;
    }
    const resign = new ResignationModel({
      userId: user.userId,
      employeeName: user.name,
      reason,
    });

    await resign.save();

    res
      .status(200)
      .json({ success: true, message: "Request Send to HR and CEO" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptResign = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const id = req.params;
  const { userId, reason } = req.body;
  try {
    // check employee have authorization or not
    if (user.employeeType != "ceo" || user.employeeType != "hr") {
      res.status(400).json({ success: false, message: "you are Unauthorized" });
      return;
    }

    // get Employee Detail from DB
    const reasignEmployee = await EmployeeModel.findById(userId);
    if (!reasignEmployee) {
      res.status(404).json({ success: false, message: "User not exist in DB" });
      return;
    }
    const date = new Date();

    const notice = {
      startDate: date,
      endDate: getAfterFifteen(),
      reason,
    };

    reasignEmployee.status = "on-notice";
    reasignEmployee.notice = notice;
    await reasignEmployee.save();

    await ResignationModel.findByIdAndUpdate(
      id,
      {
        $set: { status: "accept" },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "resign Accepted successful" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingNoticeRequest = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  try {
    // check employee have authorization or not
    if (user.employeeType != "ceo" || user.employeeType != "hr") {
      res.status(400).json({ success: false, message: "you are Unauthorized" });
      return;
    }

    const reasignEmployee = await ResignationModel.find({ status: "pending" });
    res.status(200).json({ success: true, employee: reasignEmployee });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
