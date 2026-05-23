// Import dependencies
import 'dotenv/config';
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import FoodRouter from "./Routes/FoodItemRoute.js";
import userRouter from "./Routes/UserRoute.js";
import orderRouter from './Routes/orderRoute.js';
import cartRouter from './Routes/cartRoute.js';
import adminRouter from './Routes/AdminRoutes.js';
import messageRouter from "./Routes/messageRouter.js"
import categoryRouter from "./Routes/categoryRoute.js";
import { Server } from "socket.io";
import http from "http";


const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app); // HTTP server create kiya

// Socket.io config with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST"],
    credentials: true             // Isko add karna safe rehta hai sessions/cookies ke liye
  }
});

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     // origin: "http://10.61.7.14:5173", // Apne frontend ka URL daalein
//     methods: ["GET", "POST"]
//   }
// });


// Middleware
app.use(express.json());
app.use(cors());
// app.use(cors({
//    origin: "http://10.61.7.14:5173",
//    credentials: true
// }));

app.use("/images", express.static('uploads')); // Images access karne ke liye

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/food", FoodRouter)
app.use("/api/user", userRouter)
app.use("/api/order", orderRouter)
app.use("/api/cart", cartRouter)
app.use("/api/admin", adminRouter)
app.use("/api/message", messageRouter)
app.use("/api/category", categoryRouter);


// Socket Connections Logic
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // 1. User ko join karwana (Uski apni ID ke room mein)
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // 2. Message receive karna aur turant bhej dena
  socket.on("send_message", (data) => {
    // Room (receiverId) mein message bhejo
    io.to(data.receiverId).emit("receive_message", data);
  });

  socket.on("delete_message", (data) => {
    const { messageId, receiverId } = data;
    // Receiver ke room mein "message_deleted" signal bhej do
    io.to(receiverId).emit("message_deleted", messageId);
  });



  socket.on("disconnect", () => {
    console.log("User disconnected");
  });


});



mongoose.connect(process.env.DB_URL)

  .then(() => {
    console.log("MongoDB connected");

    server.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err))
