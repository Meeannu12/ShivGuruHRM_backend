import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface IMEmployeeProfile extends Document {
    pannel: string
    userId: Types.ObjectId
    employeeType: "freelancer" | "full_time" | "part_time" | "intern"
    name: string
    email: string
    dob: string,
    number: string
    altnumber: string
    blood: string
    bankName: string
    backIFSC: string
    accNumber: string
    salary: string
    designation: string
    department: string
    address: string
    photo: string
    aadhar: string
    pan: string
    marksheet10: string
    marksheet12: string
    diploma: string
    masters: string
    resume: string
    expLetter: string
    salarySlip: string
    giveIdCard: boolean
    joiningLetter: boolean
}


const employeeProfileSchema = new Schema<IMEmployeeProfile>({
    pannel: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmployeeAuth",
        required: true
    },
    employeeType: {
        type: String,
        enum: ["freelancer", "full_time", "part_time", "intern"],
        required: true,
    },
    name: String,
    email: String,
    dob: String,
    number: String,
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
    photo: String,
    aadhar: String,
    pan: String,
    marksheet10: String,
    marksheet12: String,
    diploma: String,
    masters: String,
    resume: String,
    expLetter: String,
    salarySlip: String,
    giveIdCard: {
        type: Boolean,
        default: false
    },
    joiningLetter: {
        type: Boolean,
        default: false
    }

}, { timestamps: true, versionKey: false })


export default model<IMEmployeeProfile>("EmployeeProfile", employeeProfileSchema)