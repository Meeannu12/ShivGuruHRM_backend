import { Request, Response } from "express";
import PaswordManagerModel from "../models/paswordManager.model";


export const addPasswordManager = async (req: Request, res: Response) => {
    try {
        const { server, userName, password, website, note } = req.body

        if (!server || !userName || !password || !website || !note) {
            res.status(404).json({ success: false, message: "server, userName, password, website, note this fields are required" })
            return
        }

        await PaswordManagerModel.create({ server, userName, password, website, note })
        res.status(201).json({ success: true, message: "Credential save successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}


export const getPasswordCredential = async (req: Request, res: Response) => {
    try {
        const newCredential = await PaswordManagerModel.find({})
        res.status(200).json({ success: false, message: "get All Credentail", newCredential })

    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}

export const updatePasswordCredential = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { server, userName, password, website, note } = req.body;

        if (!server && !userName && !password && !website && !note) {
            return res.status(400).json({
                success: false,
                message: "At least one field must be provided to update"
            });
        }

        const updatedCredential = await PaswordManagerModel.findByIdAndUpdate(
            id,
            // { server, userName, password, website, note },
            req.body,
            { new: true } // return updated data
        );

        if (!updatedCredential) {
            res.status(404).json({
                success: false,
                message: "Credential not found"
            });
            return
        }

        res.status(200).json({
            success: true,
            message: "Credential updated successfully",
            updatedCredential
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};


export const deletePasswordCredential = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedCredential = await PaswordManagerModel.findByIdAndDelete(id);

        if (!deletedCredential) {
            res.status(404).json({
                success: false,
                message: "Credential not found"
            });
            return
        }

        res.status(200).json({
            success: true,
            message: "Credential deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};


