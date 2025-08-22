// import mongoose, { Document, Schema } from "mongoose";
// import bcrypt from "bcryptjs";

// // Define Staff interface for TypeScript
// export interface IStaff extends Document {
//   name: string;
//   number: string;
//   email: string;
//   staffId: string;
//   isActive: boolean;
//   role: "ceo" | "cfo" | "hr" | "manager" | "employee";
//   designation: string;
//   password: string;
//   joinDate: Date;
//   job_type: "full-time" | "part-time" | "contract";
//   comparePassword(candidatePassword: string): Promise<boolean>;
// }

// const StaffSchema: Schema<IStaff> = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     number: {
//       type: String,
//       required: true,
//       match: [/^\d{10}$/, "Phone number must be 10 digits"],
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         "Please enter a valid email",
//       ],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//       select: false, // Hide password by default
//     },
//     staffId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     role: {
//       type: String,
//       enum: ["ceo", "cfo", "hr", "manager", "employee"],
//       required: true,
//     },
//     designation: {
//       type: String,
//       required: true,
//     },
//     joinDate: {
//       type: Date,
//       default: Date.now,
//     },
//     job_type: {
//       type: String,
//       enum: ["full-time", "part-time", "contract"],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before saving
// StaffSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Compare entered password with hashed one
// StaffSchema.methods.comparePassword = async function (
//   candidatePassword: string
// ): Promise<boolean> {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.model<IStaff>("Staff", StaffSchema);

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IEmployee extends Document {
  name: string;
  fatherName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  employeeId: String;
  bloodGroup: string;
  bankName: string;
  bankIfsc: string;
  accountNumber: string;
  designation: string;
  isActive: boolean;
  department:
    | "digital-department"
    | "sales-and-marketing-department"
    | "hr-department"
    | "technical-department"
    | "information-and-security-department";
  password: string;
  joinDate: Date;
  employeeType:
    | "ceo"
    | "cfo"
    | "cso"
    | "managing director"
    | "general manager"
    | "hr"
    | "manager"
    | "training"
    | "employee"
    | "intern"
    | "freelancer";
  address: string;

  // File uploads (URLs / paths)
  aadhaarCard?: string | null;
  photo?: string | null;
  tenthMarksheet?: string | null;
  twelfthMarksheet?: string | null;
  degree?: string | null;
  masterDegree?: string | null;
  experienceLetter?: string | null;
  salarySlip?: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const EmployeeSchema: Schema<IEmployee> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    alternatePhone: { type: String },
    bloodGroup: { type: String, required: true },
    bankName: { type: String, required: true },
    bankIfsc: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    employeeId: { type: String, required: true },
    isActive: {
      type: Boolean,
      default: true,
    },
    department: {
      type: String,
      enum: [
        "technical-department",
        "digital-department",
        "sales-and-marketing-department",
        "hr-department",
        "information-and-security-department",
      ],
      required: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    joinDate: { type: Date, default: Date.now },
    employeeType: {
      type: String,
      enum: [
        "ceo",
        "cfo",
        "cso",
        "managing-director",
        "general-manager",
        "hr",
        "manager",
        "training",
        "employee",
        "intern",
        "freelancer",
      ],
      required: true,
    },
    address: { type: String, required: true },

    // File uploads → just store URLs or file paths
    aadhaarCard: { type: String },
    photo: { type: String },
    tenthMarksheet: { type: String },
    twelfthMarksheet: { type: String },
    degree: { type: String },
    masterDegree: { type: String },
    experienceLetter: { type: String },
    salarySlip: { type: String },
  },
  { timestamps: true }
);

// Hash password before saving
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed one
EmployeeSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
