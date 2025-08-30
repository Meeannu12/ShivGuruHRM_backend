// import { io } from "socket.io-client";
const io = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGE4MTM1OGU5NTg4YTkxOTI0YmM0YmYiLCJuYW1lIjoiQW51cmFnIEt1bWFyIiwiZW1wbG95ZWVJZCI6InNoaXZlbXAwMDYiLCJpc0FjdGl2ZSI6dHJ1ZSwic3RhdHVzIjoib24tbm90aWNlIiwiZW5kRGF0ZSI6IjIwMjUtMDktMDdUMTI6MTA6NDAuODY3WiIsImVtcGxveWVlVHlwZSI6ImNlbyIsImlhdCI6MTc1NjQ2NjcwMCwiZXhwIjoxNzU2NDcwMzAwfQ.AKH9OoLEBcq-pM20J9dD8oK2R-zzRhcJiK39chbTQMY", // apna JWT token daal
  },
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
  socket.emit("connected");
});

socket.on("receiveMessage", (msg) => {
  console.log("📩 New message received:", msg);
});

// Apna message bhejne ka example
setTimeout(() => {
  socket.emit("sendMessage", {
    receiver: "userid_123", // jis user ko bhejna hai
    message: "Hello Bhai!",
  });
}, 2000);

socket.on("disconnect", () => {
  console.log("Disconnected");
});
