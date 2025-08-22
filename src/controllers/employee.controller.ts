import { Router, Request, Response } from "express";
import Employee from "../models/employee.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getNextEmployeeId from "../config/employeeId";

// create new staff
export const createStaff = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    // console.log("files", files); // ✅ uploaded files info
    // console.log("body", req.body); // ✅ other form data

    // Validation check
    if (!req.body.name || !req.body.email || !req.body.phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const employeeId = await getNextEmployeeId(); // ✅ custom ID generate

    // Push into database
    const employee = new Employee({
      name: req.body.name,
      fatherName: req.body.fatherName,
      phone: req.body.phone,
      alternatePhone: req.body.alternatePhone,
      email: req.body.email,
      bloodGroup: req.body.bloodGroup,
      bankName: req.body.bankName,
      bankIfsc: req.body.bankIfsc,
      accountNumber: req.body.accountNumber,
      designation: req.body.designation,
      department: req.body.department,
      password: req.body.password,
      address: req.body.address,
      joinDate: req.body.joinDate,
      employeeType: req.body.employeeType,
      employeeId,
      // file added here
      aadhaarCard: files?.aadhaarCard?.[0]?.filename || null,
      photo: files?.photo?.[0]?.filename || null,
      tenthMarksheet: files?.tenthMarksheet?.[0]?.filename || null,
      twelfthMarksheet: files?.twelfthMarksheet?.[0]?.filename || null,
      degree: files?.degree?.[0]?.filename || null,
      masterDegree: files?.masterDegree?.[0]?.filename || null,
      experienceLetter: files?.experienceLetter?.[0]?.filename || null,
      salarySlip: files?.salarySlip?.[0]?.filename || null,
    });

    await employee.save();

    res.status(200).json({
      message: "Staff registered successfully!",
      // files: req.files,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// // login staff api
export const employeeLogin = async (req: Request, res: Response) => {
  try {
    const { employeeId, password } = req.body;
    const employee = await Employee.findOne({ employeeId }).select("+password");
    // console.log("login User Data", staffId, password, staff);
    if (!employee) {
      return res.status(404).json({ message: "employee id is incorrect" });
    }
    const matchPassword = await bcrypt.compare(password, employee.password);
    if (!matchPassword) {
      return res.status(401).json({ message: "password is incorrect" });
    }

    const payload = {
      userId: employee._id,
      name: employee.name,
      employeeId: employee.employeeId,
      isActive: employee.isActive,
      employeeType: employee.employeeType,
    };

    // create jwt token and send the user
    // console.log("check Token:", process.env.JWT_SECRET);
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    // continue if login is successful
    res.status(200).json({
      message: "Login successful",
      token,
      employee: payload,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllEmployee = async (req: Request, res: Response) => {
  try {
    const user = await Employee.find();
    res.status(200).json({ message: "get all Employee", user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// // update staff status is active or not
// export const staffStatusUpdate = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { isActive } = req.body;

//   try {
//     // console.log("response", id, isActive);
//     await User.findByIdAndUpdate(id, { isActive });
//     res.json({ message: "Status updated successfully" });
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // delete Staff by id only ceo cfo or hr can delete the staff
// export const deleteStaff = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const response = await User.findByIdAndDelete(id);
//     if (!response) {
//       res.status(404).json({ message: "staff not found in DB" });
//       return;
//     }
//     res.status(200).json({ message: "staff Deleted Successful" });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
