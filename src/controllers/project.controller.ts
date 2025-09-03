import { Request, Response } from "express";
import ProjectModel, { IProject } from "../models/project.model";
import { AuthRequest } from "../middleware/auth";
import ClientModel from "../models/client.model";

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
    const newProject = await ProjectModel.find({ status: "pending" }).populate(
      "client"
    );
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

export const submitProject = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  // console.log("user Response", user);

  const { submitDate, id } = req.body;
  try {
    // console.log("submit Project Date", submitDate);

    const newSubmitProject = await ProjectModel.findById(id);
    if (!newSubmitProject)
      return res
        .status(404)
        .json({ success: false, message: "Project not Exist In DB" });

    // console.log("get Client", newSubmitProject);
    await ClientModel.findByIdAndUpdate(
      newSubmitProject.client,
      {
        $inc: { wallet: newSubmitProject.amount }, // jitna amount hai, utna add karega
      },
      { new: true } // updated document return karega
    );

    newSubmitProject.submitDate = submitDate;
    newSubmitProject.status = "complete";
    await newSubmitProject.save();

    res.status(201).json({
      success: true,
      message: `project Submit on ${new Date(submitDate).toISOString().split("T")[0]}`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
