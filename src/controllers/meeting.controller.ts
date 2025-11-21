import { Request, Response } from "express";
import MeetingModel from "../models/meeting.model";



export const createMeeting = async (req: Request, res: Response) => {
    try {
        const { title, date, time, link } = req.body
        if (!title || !date || !time || !link) {
            res.status(400).json({ success: false, message: "title , date , time, link is required" })
            return
        }

        await MeetingModel.create({ title, date, time, link })

        res.status(201).json({ success: true, message: "meeting create successful" })

    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}


export const getAllMeets = async (req: Request, res: Response) => {
    try {
        const newMeeting = await MeetingModel.find({})
        res.status(200).json({ success: false, meet: newMeeting })
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}


export const deleteMeet = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        await MeetingModel.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: "meeting delete successful" })
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}