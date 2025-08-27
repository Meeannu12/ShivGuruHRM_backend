import { Request, Response } from "express";
import ClientModel, { IClient } from "../models/client.model";
import { AuthRequest } from "../middleware/auth";

export const addClient = async (req: Request, res: Response) => {
  const { name, phone, address, email }: IClient = req.body;
  try {
    console.log(name, phone, address, email);

    const existingClient = await ClientModel.findOne({
      $or: [{ phone }, { email }],
    });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "User with this phone or email already exists",
      });
    }

    // agar user exist nahi karta to naya create karo
    const newClient = new ClientModel({
      name,
      phone,
      address,
      email,
    });

    // save the user details
    await newClient.save();

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      //   data: newClient,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllClient = async (req: AuthRequest, res: Response) => {
  const userRole = req.user.employeeType;
  try {
    if (!["ceo", "cfo", "manager"].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: "Access denied You are not Authorize",
      });
    }

    const AllClient = await ClientModel.find();
    res.status(200).json({ success: true, client: AllClient });
  } catch (err: any) {
    res.status(500).json({ success: false, messsage: err.message });
  }
};
