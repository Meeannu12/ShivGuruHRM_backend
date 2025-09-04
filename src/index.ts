import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
const http = require("http");
const { Server } = require("socket.io");
import attendanceRoute from "./routes/attendance.route";
import taskRoute from "./routes/task.route";
import employeeRoute from "./routes/employee.routes";
import serveNotice from "./routes/resignation.routes";
import clientRoute from "./routes/client.route";
import projectRoute from "./routes/project.route";
import { chatSocket } from "./sockets/chatSocket";
import chatRoute from "./routes/chats.route";
import notificationRoute from "./routes/notification.route";
dotenv.config();
// import productRoutes from "./routes/product.routes";

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://office.shivgurusoftware.com", "http://localhost:3000"],
    credentials: true,
  },
});

app.use(express.json()); // parse JSON body

connectDB();
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // if you send cookies/auth headers
    methods: ["GET", "POST", "PUT"], // yaha specify karo jo methods chahiye
    allowedHeaders: ["Content-Type", "Authorization"], // agar custom headers chahiye
  })
);

// Routes
app.use("/api/employee", employeeRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/task", taskRoute);
app.use("/api/serveNotice", serveNotice);
app.use("/api/client", clientRoute);
app.use("/api/project", projectRoute);
app.use("/api/chats", chatRoute);
app.use("/api/notification", notificationRoute);

app.get("/api/check", (req, res) => {
  res.json({ message: "Server running and socket.io is ready" });
});

// use socket
chatSocket(io);
// app.use("/api/products", productRoutes);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
