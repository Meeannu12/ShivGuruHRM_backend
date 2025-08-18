import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Define Staff interface for TypeScript
export interface IStaff extends Document {
  name: string;
  number: string;
  email: string;
  staffId: string;
  isActive: boolean;
  role: "ceo" | "cfo" | "hr" | "manager" | "employee";
  designation: string;
  password: string;
  joinDate: Date;
  job_type: "full-time" | "part-time" | "contract";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const StaffSchema: Schema<IStaff> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Hide password by default
    },
    staffId: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["ceo", "cfo", "hr", "manager", "employee"],
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    job_type: {
      type: String,
      enum: ["full-time", "part-time", "contract"],
      required: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
StaffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed one
StaffSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IStaff>("Staff", StaffSchema);
