import { Request, Response } from "express";
import TrustBill from "../models/trust.bill";

export const createTrustBill = async (req: Request, res: Response) => {
    try {
        const { title, description, amount } = req.body
        if (!title || !description || !amount) {
            res.status(400).json({ success: false, message: "title, description, amount is required in body" })
            return
        }

        const data: any = {
            title,
            description,
            amount,
        }

        console.log("check response what come", req.file, title,
            description,
            amount,)

        if (req.file) data.image = req.file.filename

        await TrustBill.create(data);
        res.status(201).json({ success: true, message: "Entry create successful" })
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}

export const getTrustBill = async (req: Request, res: Response) => {
    try {
        const trustBillList = await TrustBill.find({})

        res.status(200).json({ success: true, list: trustBillList })

    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}

export const trustDeleteById = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        await TrustBill.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: "entry delete successful" })
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}