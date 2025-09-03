import { Request, Response } from "express";
import ProjectModel, { IProject } from "../models/project.model";

export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      name,
      code,
      assignDate,
      deadline,
      client,
      language,
      amount,
    }: IProject = req.body;

    // console.log(
    //   "create Project",
    //   name,
    //   code,
    //   assignDate,
    //   deadline,
    //   client,
    //   language,
    //   amount
    // );

    const newProject = new ProjectModel({
      name,
      code,
      assignDate,
      deadline,
      client,
      language,
      amount,
    });
    await newProject.save();
    res
      .status(201)
      .json({ success: true, message: "New Project Add Successful" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProject = async (req: Request, res: Response) => {
  try {
    const newProject = await ProjectModel.find().populate("client");
    const pendingProject = await ProjectModel.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      success: true,
      message: "Get All Project Successfully",
      project: newProject,
      pendingProject,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
