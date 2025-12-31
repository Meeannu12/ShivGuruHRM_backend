import { Document, model, Schema } from "mongoose";
import bcrypt from 'bcryptjs'



interface IEmployeeAuth extends Document {
    name: string
    isActive: boolean
    employeeId: string
    phone: string
    status: "active" | "on-notice" | "exit";
    role: Schema.Types.ObjectId
    password: string
    employeeType: "freelancer" | "full_time" | "part_time" | "intern",
    email: string,
    dob: Date,
    altnumber: string
    blood: string
    bankName: string
    backIFSC: string
    accNumber: string
    salary: string
    designation: string
    department: string
    address: string
    giveIdCard: boolean
    joiningLetter: boolean
    // image url enter here
    photo: string
    aadhar: string
    pan: string
    marksheet10: string
    marksheet12: string
    masters: string
    resume: string
    expLetter: string
    salarySlip: string
    comparePassword(candidatePassword: string): Promise<boolean>;
}


const EmployeeAuthAchema = new Schema<IEmployeeAuth>({
    name: String,
    isActive: {
        type: Boolean,
        default: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    status: {
        type: String,
        enum: ["active", "on-notice", "exit"],
        default: "active"
    },
    role: {
        type: Schema.Types.ObjectId, ref: "roleModel", required: true
    },
    password: { type: String, required: true, minlength: 6, select: false },
    employeeType: {
        type: String,
        enum: ["freelancer", "full_time", "part_time", "intern"],
        required: true,
    },
    email: String,
    dob: String,
    altnumber: String,
    blood: String,
    bankName: String,
    backIFSC: String,
    accNumber: {
        type: String,
        required: true,
        unique: true
    },
    salary: String,
    designation: String,
    department: String,
    address: String,
    giveIdCard: {
        type: Boolean,
        default: false
    },
    joiningLetter: {
        type: Boolean,
        default: false
    },
    photo: String,
    aadhar: String,
    pan: String,
    marksheet10: String,
    marksheet12: String,
    masters: String,
    resume: String,
    expLetter: String,
    salarySlip: String,
}, { timestamps: true, versionKey: false })




// Hash password before saving
EmployeeAuthAchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare entered password with hashed one
EmployeeAuthAchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

EmployeeAuthAchema.index({ employeeId: 1 })


export default model<IEmployeeAuth>("EmployeeAuth", EmployeeAuthAchema)