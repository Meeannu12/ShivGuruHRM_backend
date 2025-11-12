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


export default model<IEmployeeAuth>("EmployeeAuth", EmployeeAuthAchema)