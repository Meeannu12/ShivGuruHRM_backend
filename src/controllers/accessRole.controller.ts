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

        const newAccess = await RoleModel.findOne({ name: name.toLowerCase() })
        if (newAccess) {
            res.status(404).json({ success: false, message: `${name} already exist in DB` })
            return
        }

        await RoleModel.create({ name: name.toLowerCase(), access })

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

export const updateRoleById = async (req: AuthRequest, res: Response) => {
    const id = req.params.id
    const access = req.body.access
    try {

        /* 🔒 Validate access */
        if (!Array.isArray(access)) {
            res.status(400).json({ success: false, message: "Access must be an array" });
            return
        }

        const existRole = await RoleModel.findByIdAndUpdate(id, { $set: { access } }, { new: true })
        if (!existRole) {
            res.status(404).json({ success: false, message: "this access module not exist " })
            return
        }

        res.status(200).json({ success: true, message: "Access module updated successfully" })



    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}


export const deleteRoleById = async (req: AuthRequest, res: Response) => {
    const id = req.params.id
    try {


        const existRole = await RoleModel.findByIdAndDelete(id)
        if (!existRole) {
            res.status(404).json({ success: false, message: "This role not found" })
            return
        }
        res.status(200).json({ success: true, message: "role delete successful" })
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}