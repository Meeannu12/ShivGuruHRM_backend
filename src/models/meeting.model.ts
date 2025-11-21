import { Document, model, Schema } from "mongoose";


interface IMeeting extends Document {
    title: string
    date: string
    time: string
    link: string
}


const meetingSchema = new Schema<IMeeting>({
    title: String,
    date: String,
    time: String,
    link: String,
}, { timestamps: true, versionKey: false })


export default model<IMeeting>("meetings", meetingSchema)