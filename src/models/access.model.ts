import { Document, model, Schema } from "mongoose";


export interface IMAccess extends Document {
    name: string
}

export interface IMRole extends Document {
    name: string
}



const accessSchema = new Schema<IMAccess>({
    name: {
        type: String,
        unique: true,
    }
}, { timestamps: true, versionKey: false })


const AccessModel = model<IMAccess>("accessModel", accessSchema)

const roleSchema = new Schema<IMRole>({
    name: {
        type: String,
        unique: true,
    }
}, { timestamps: true, versionKey: false })


const roleModel = model<IMRole>("roleModel", roleSchema)


export { AccessModel, roleModel }