
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: { type: String, required: true }, // Jo message bhej raha hai
    receiverId: { type: String, required: true }, // Jo message receive kar raha hai (Admin ID)
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);
export default messageModel;