import { Document, model, Schema } from "mongoose";

export interface IMPasswordManager extends Document {
    server: string
    userName: string
    password: string
    website: string
    note: string
}


const passwordManagerSchema = new Schema<IMPasswordManager>({
    server: { type: String, unique: true },
    userName: String,
    password: String,
    website: { type: String, unique: true },
    note: String
}, { timestamps: true, versionKey: false })


export default model<IMPasswordManager>("PasswordManager", passwordManagerSchema)