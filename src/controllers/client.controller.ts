import { Request, Response } from "express";
import ClientModel, { IClient } from "../models/client.model";
import { AuthRequest } from "../middleware/auth";
import ClientHistoryModel from "../models/clientHistory.model";

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

// work with client history model and api's

export const addClientEntry = async (req: AuthRequest, res: Response) => {
  const userRole = req.user.employeeType;
  const { clientId, creditAmount } = req.body;
  try {
    // console.log("addClientEntry", clientId, creditAmount);
    if (!["ceo", "cfo"].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: "Access denied You are not Authorize",
      });
    }
    // check client is exist or not
    const newClient = await ClientModel.findById(clientId);
    // console.log("check Client details", newClient);
    if (!newClient) {
      res
        .status(404)
        .json({ success: false, message: "Client is not exist in DB" });
      return;
    }

    const clientHis = new ClientHistoryModel({
      client: newClient._id,
      remainingAmount: newClient.wallet - creditAmount,
      creditAmount,
    });

    await clientHis.save();

    newClient.wallet -= creditAmount;
    await newClient.save();
    res
      .status(201)
      .json({ success: true, message: "save Client Credit Entry" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClientEntry = async (req: AuthRequest, res: Response) => {
  const userRole = req.user.employeeType;
  try {
    if (!["ceo", "cfo"].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: "Access denied You are not Authorize",
      });
    }

    // user se query me date aayegi ?startDate=2025-08-01&endDate=2025-08-28
    let { startDate, endDate } = req.query as {
      startDate?: string;
      endDate?: string;
    };

    if (!startDate || !endDate) {
      const now = new Date();
      // current month ka 1st date
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      // current month ka last date
      const lastDay = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      startDate = firstDay.toISOString();
      endDate = lastDay.toISOString();
    }
    const newClient = await ClientHistoryModel.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate("client");

    res.status(200).json({
      success: true,
      message: "get All Client History",
      client: newClient,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
