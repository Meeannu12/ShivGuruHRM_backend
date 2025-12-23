import { Request, Response } from "express";
import LaserModel from "../models/laser.model";



export const addNewLaser = async (req: Request, res: Response) => {
    const { title, date, credit, debit, employee, employee_type } = req.body
    try {
        if (!title || !date || !credit || !debit || !employee || !employee_type) {
            res.status(400).json({ success: false, message: "title, date, credit, debit, employee, employee_type is required" })
            return
        }

        await LaserModel.create(req.body)

        res.status(201).json({ success: false, message: "new Laser create successful" })

    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}


export const getLasers = async (req: Request, res: Response) => {
    try {
        const existLaser = await LaserModel.find()

        if (existLaser.length === 0) {
            res.status(200).json({ success: true, message: "laser not fount", existLaser })
            return
        }

        res.status(200).json({ success: true, message: "get all laser", existLaser })

    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}