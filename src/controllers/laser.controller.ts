import { Request, Response } from "express";
import LaserModel, { IMLaser } from "../models/laser.model";



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
        const today = new Date();

        // toDate → today if not provided
        const toDate = req.query.toDate
            ? new Date(req.query.toDate as string)
            : today;

        // fromDate → 1 month back if not provided
        const fromDate = req.query.fromDate
            ? new Date(req.query.fromDate as string)
            : new Date(new Date(toDate).setMonth(toDate.getMonth() - 1));

        const existLaser = await LaserModel.find({
            date: {
                $gte: fromDate,
                $lte: toDate
            }
        }).populate({
            path: "employee",
            select: "name"
        });

        if (existLaser.length === 0) {
            res.status(200).json({
                success: true,
                message: "laser not found",
                existLaser: [],
                amount: 0
            });
            return
        }
        const totals = existLaser.reduce(
            (acc: { totalCredit: number, totalDebit: number }, item: IMLaser) => {
                acc.totalCredit += item.credit || 0;
                acc.totalDebit += item.debit || 0;
                return acc;
            },
            { totalCredit: 0, totalDebit: 0 }
        );

        const amount = totals.totalCredit - totals.totalDebit;
        res.status(200).json({ success: true, message: "get all laser", existLaser, amount })

    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}

export const getNameByMonth = async (req: Request, res: Response) => {
    const today = new Date();

    // toDate → today if not provided
    const toDate = req.query.toDate
        ? new Date(req.query.toDate as string)
        : today;

    // fromDate → 1 month back if not provided
    const fromDate = req.query.fromDate
        ? new Date(req.query.fromDate as string)
        : new Date(new Date(toDate).setMonth(toDate.getMonth() - 1));
    try {

        const result = await LaserModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: fromDate,
                        $lte: toDate,
                    },
                },
            },
            {
                $group: {
                    _id: "$employee", // unique employee
                    employee_type: { $first: "$employee_type" },
                },
            },
            {
                $lookup: {
                    from: "employeeauths", // collection name
                    localField: "_id",
                    foreignField: "_id",
                    as: "employee",
                },
            },
            {
                $unwind: "$employee",
            },
            {
                $project: {
                    _id: 0,
                    employee: 1,
                    employee_type: 1,
                },
            },
        ])

        res.status(200).json({
            success: true,
            count: result.length,
            data: result,
        })

    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}

export const getAllEntryByName = async (req: Request, res: Response) => {
    const id = req.params.id
    const today = new Date();

    // toDate → today if not provided
    const toDate = req.query.toDate
        ? new Date(req.query.toDate as string)
        : today;

    // fromDate → 1 month back if not provided
    const fromDate = req.query.fromDate
        ? new Date(req.query.fromDate as string)
        : new Date(new Date(toDate).setMonth(toDate.getMonth() - 1));
    try {

        const existLaser = await LaserModel.find({
            employee: id,
            date: {
                $gte: fromDate,
                $lte: toDate
            }
        }).populate({
            path: "employee",
            select: "name"
        });

        res.status(200).json({ success: true, laser: existLaser })


    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}


export const deleteLaser = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const deletedLaser = await LaserModel.findByIdAndDelete(id);

        // ✅ Not found check
        if (!deletedLaser) {
            return res.status(404).json({
                success: false,
                message: "Laser not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Laser deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}