import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AccessModel, RoleModel } from "../models/access.model";


// access model write here
export const addAccessModule = async (req: AuthRequest, res: Response) => {
    const name = req.body.name
    try {
        if (!name) {
            res.status(404).json({ success: false, message: "name is required" })
            return
        }

        const newAccess = await AccessModel.findOne({ name })
        if (newAccess) {
            res.status(404).json({ success: false, message: `${name} already exist in DB` })
            return
        }

        await AccessModel.create({ name })

        res.status(201).json({ success: true, message: "Access module add Successful" })



    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}


export const getAllAccessModel = async (req: AuthRequest, res: Response) => {
    try {
        const newAccess = await AccessModel.find({})

        res.status(200).json({ success: true, access: newAccess })

    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}




// role add successful
export const addRoleModule = async (req: AuthRequest, res: Response) => {
    const { name, access } = req.body
    try {
        if (!name) {
            res.status(404).json({ success: false, message: "name is required" })
            return
        }

        const newAccess = await RoleModel.findOne({ name })
        if (newAccess) {
            res.status(404).json({ success: false, message: `${name} already exist in DB` })
            return
        }

        await RoleModel.create({ name, access })

        res.status(201).json({ success: true, message: "Role add Successful" })



    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}

export const getAllRole = async (req: AuthRequest, res: Response) => {
    try {
        const newRole = await RoleModel.find({})

        res.status(200).json({ success: true, role: newRole })

    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}