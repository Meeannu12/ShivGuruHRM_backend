import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import StaffRoute from "./routes/employee.routes";
import dotenv from "dotenv";
import cors from "cors";
import attendanceRoute from "./routes/attendance.route";
import taskRoute from "./routes/task.route";
import EmployeeRoute from "./routes/employee.routes";
dotenv.config();
// import productRoutes from "./routes/product.routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // parse JSON body

connectDB();
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // if you send cookies/auth headers
    methods: ["GET", "POST"], // yaha specify karo jo methods chahiye
    allowedHeaders: ["Content-Type", "Authorization"], // agar custom headers chahiye
  })
);

// Routes
app.use("/api/employee", EmployeeRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/task", taskRoute);

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running on 3000" });
});
// app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
