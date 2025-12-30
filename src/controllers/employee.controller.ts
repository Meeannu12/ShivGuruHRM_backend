import { Router, Request, Response } from "express";
import Employee from "../models/employee.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getNextEmployeeId from "../config/employeeId";
import EmployeeAuthModel from "../models/employeeAuth.model";
import { AuthRequest } from "../middleware/auth";
import EmployeeProfileModel from "../models/employee.profile.model";



export const createStaff = async (req: Request, res: Response) => {
  const { name, phone, password, role } = req.body
  try {
    if (!name || !phone || !password || !role) {
      res.status(400).json({ success: false, message: "required missing field name, phone, password, role" })
      return
    }

    const employeeId = await getNextEmployeeId(); // ✅ custom ID generate

    const newEntry = new EmployeeAuthModel({
      name, phone, password, employeeId, role
    })

    await newEntry.save()

    res.status(201).json({ success: true, message: "Employee create successful" })

  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message })
  }
}


// export const 

// create new staff
// export const createStaff = async (req: Request, res: Response) => {
//   try {
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//     // console.log("files", files); // ✅ uploaded files info
//     // console.log("body", req.body); // ✅ other form data

//     // Validation check
//     if (!req.body.name || !req.body.email || !req.body.phone) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const employeeId = await getNextEmployeeId(); // ✅ custom ID generate

//     // Push into database
//     const employee = new Employee({
//       name: req.body.name,
//       fatherName: req.body.fatherName,
//       phone: req.body.phone,
//       alternatePhone: req.body.alternatePhone,
//       email: req.body.email,
//       bloodGroup: req.body.bloodGroup,
//       bankName: req.body.bankName,
//       dob: req.body.dob,
//       bankIfsc: req.body.bankIfsc,
//       accountNumber: req.body.accountNumber,
//       designation: req.body.designation,
//       department: req.body.department,
//       password: req.body.password,
//       address: req.body.address,
//       joinDate: req.body.joinDate,
//       employeeType: req.body.employeeType,
//       salary: req.body.salary,
//       employeeId,
//       // file added here
//       panCard: files?.panCard?.[0]?.filename || null,
//       aadhaarCard: files?.aadhaarCard?.[0]?.filename || null,
//       photo: files?.photo?.[0]?.filename || null,
//       tenthMarksheet: files?.tenthMarksheet?.[0]?.filename || null,
//       twelfthMarksheet: files?.twelfthMarksheet?.[0]?.filename || null,
//       degree: files?.degree?.[0]?.filename || null,
//       masterDegree: files?.masterDegree?.[0]?.filename || null,
//       experienceLetter: files?.experienceLetter?.[0]?.filename || null,
//       salarySlip: files?.salarySlip?.[0]?.filename || null,
//     });

//     await employee.save();

//     res.status(200).json({
//       message: "Staff registered successfully!",
//       // files: req.files,
//     });
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // login staff api
export const employeeLogin = async (req: Request, res: Response) => {
  try {
    const { employeeId, password } = req.body;
    const employee = await EmployeeAuthModel.findOne({ employeeId }).select("+password").populate("role");
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
      number: employee.phone,
      employeeId: employee.employeeId,
      isActive: employee.isActive,
      status: employee.status,
      role: (employee.role as any)?.name || "N/A",
      access: (employee.role as any)?.access || [],
      // endDate:
      //   employee.status === "on-notice"
      //     ? employee?.notice?.endDate.toISOString()
      //     : "",
    };

    // create jwt token and send the user
    // console.log("check Token:", process.env.JWT_SECRET);
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "8d",
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
    const user = await EmployeeAuthModel.find().populate("role");
    // const totalActiveEmployee = await EmployeeAuthModel.countDocuments({
    //   status: { $in: ["active", "on-notice"] },
    // });
    // const totalFreelancer = await Employee.countDocuments({
    //   status: { $in: ["active", "on-notice"] },
    //   employeeType: "freelancer",
    // });
    // const totalOnnotice = await EmployeeAuthModel.countDocuments({
    //   status: "on-notice",
    // });

    res.status(200).json({
      message: "get all Employee",
      user,
      // total: totalActiveEmployee,
      // freelancer: totalFreelancer,
      // onNotice: totalOnnotice,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// get user own details 
export const me = async (req: AuthRequest, res: Response) => {
  const user = req.user
  try {
    console.log("login user datials", user)

    const UserInfo = await EmployeeAuthModel.findById(user.userId).populate("role", "name access")

    if (!UserInfo) {
      res.status(404).json({ success: false, message: "Unable to get User Details" })
      return
    }

    res.status(200).json({ success: true, UserInfo })


  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message })
  }
}

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


export const addemployeeProfile = async (req: AuthRequest, res: Response) => {
  const { pannel, employeeType, email, dob, altnumber, blood, bankName, backIFSC, accNumber, salary, designation, department, address, giveIdCard, joiningLetter } = req.body
  const user = req.user
  try {
    console.log("login user datials", user)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files) {
      res.status(400).json({ success: false, message: "required file data" })
    }

    const accEmployeeType = ["freelancer", "full_time", "part_time", "intern"]
    if (!employeeType || !accEmployeeType.includes(employeeType)) {
      res.status(400).json({ success: false, message: "freelancer,full_time , part_time, intern any one is required" })
      return
    }


    // check all required fields 
    if (!pannel || !email || !dob || !altnumber || !blood || !bankName || !backIFSC || !accNumber || !salary || !designation || !department || !address || !giveIdCard || !joiningLetter) {
      res.status(400).json({
        success: false, message: "pannel, email, dob, altnumber, blood, bankName, backIFSC, accNumber, salary, designation, department, address, giveIdCard, joiningLetter must be required"
      })
      return
    }

    await EmployeeProfileModel.create({
      userId: user.userId,
      pannel,
      employeeType,
      name: user.name,
      email,
      dob,
      number: user.number || null,
      altnumber,
      blood,
      bankName,
      backIFSC,
      accNumber,
      salary,
      designation,
      department,
      address,
      photo: files?.photo?.[0]?.filename || null,
      aadhar: files?.aadhar?.[0]?.filename || null,
      pan: files?.pan?.[0]?.filename || null,
      marksheet10: files?.marksheet10?.[0]?.filename || null,
      marksheet12: files?.panCard?.[0]?.filename || null,
      masters: files?.marksheet12?.[0]?.filename || null,
      resume: files?.resume?.[0]?.filename || null,
      expLetter: files?.expLetter?.[0]?.filename || null,
      salarySlip: files?.salarySlip?.[0]?.filename || null,
      giveIdCard,
      joiningLetter,
    })


    res.status(201).json({ success: true, message: "employee profile is completed" })

  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message })
  }
}

export const getEmployeeProfile = async (req: AuthRequest, res: Response) => {
  const user = req.user
  try {
    const existProfile = await EmployeeProfileModel.find({ userId: user.userId })

    if (!existProfile) {
      res.status(404).json({ success: false, message: "your profile data not exist in DB" })
      return
    }

    res.status(200).json({ success: true, user: existProfile })

  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message })
  }
}
