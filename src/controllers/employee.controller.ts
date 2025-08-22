import { Router, Request, Response } from "express";
import User from "../models/employee.model";
import Employee from "../models/employee.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getNextEmployeeId from "../config/employeeId";

// create new staff
// export const createStaff = async (req: Request, res: Response) => {
//   try {
//     // const {
//     //   name,
//     //   number,
//     //   email,
//     //   password,
//     //   staffId,
//     //   role,
//     //   designation,
//     //   job_type,
//     //   joinDate,
//     // } = req.body;

//     // ✅ 1. Field validation (basic checks before mongoose)
//     // // if (
//     // //   !name ||
//     // //   !number ||
//     // //   !email ||
//     // //   !password ||
//     // //   !staffId ||
//     // //   !role ||
//     // //   !designation ||
//     // //   !job_type
//     // // ) {
//     // //   return res
//     // //     .status(400)
//     // //     .json({ message: "All required fields must be provided" });
//     // // }

//     // // ✅ 2. Check phone number format
//     // if (!/^\d{10}$/.test(number)) {
//     //   return res
//     //     .status(400)
//     //     .json({ message: "Phone number must be exactly 10 digits" });
//     // }

//     // ✅ 5. Unique email and staffId check
//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const existingStaffId = await User.findOne({ staffId });
//     if (existingStaffId) {
//       return res.status(400).json({ message: "Staff ID already exists" });
//     }

//     // ✅ 7. Create staff
//     const newStaff = await User.create({
//       name,
//       number,
//       email,
//       password,
//       staffId,
//       role,
//       designation,
//       job_type,
//       joinDate,
//     });

//     return res.status(201).json({
//       message: "Staff created successfully",
//     });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

// export const getAllStaff = async (req: Request, res: Response) => {
//   try {
//     const user = await User.find();
//     res.status(200).json({ message: "get all Satff", user });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // login staff api
// export const staffLogin = async (req: Request, res: Response) => {
//   try {
//     const { staffId, password } = req.body;
//     const staff = await User.findOne({ staffId: staffId }).select("+password");
//     // console.log("login User Data", staffId, password, staff);
//     if (!staff) {
//       return res.status(404).json({ message: "employee id is incorrect" });
//     }
//     const matchPassword = await bcrypt.compare(password, staff.password);
//     if (!matchPassword) {
//       return res.status(401).json({ message: "password is incorrect" });
//     }

//     const payload = {
//       userId: staff._id,
//       name: staff.name,
//       staffId: staff.staffId,
//       isActive: staff.isActive,
//       role: staff.role,
//     };

//     // create jwt token and send the user
//     // console.log("check Token:", process.env.JWT_SECRET);
//     const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
//       expiresIn: "1h",
//     });

//     // continue if login is successful
//     res.status(200).json({
//       message: "Login successful",
//       token,
//       staff: payload,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

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
