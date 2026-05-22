import express from "express";
import { sendMessage, getMessages, getAllChatsForAdmin, getAdminId, deleteMessage } from "../Controllers/MessageController.js";
import authMiddleware from "../middleware/Auth.js";

const messageRouter = express.Router();

messageRouter.post("/send", authMiddleware, sendMessage);
messageRouter.get("/get", authMiddleware, getMessages);
messageRouter.get("/adminchat", authMiddleware, getAllChatsForAdmin);
messageRouter.get("/get-admin-id", authMiddleware, getAdminId);
messageRouter.delete("/delete/:messageId", authMiddleware, deleteMessage);


export default messageRouter;