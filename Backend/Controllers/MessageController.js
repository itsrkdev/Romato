import messageModel from "../Models/MessageModel.js";
import User from "../Models/UserModel.js"; // Import check karein (User ya userModel)

// 1. Get Dynamic Admin ID (Frontend calls this)
const getAdminId = async (req, res) => {
    try {
        // Aapke Model mein role "admin" (small) hai, isliye wahi search karein
        const admin = await User.findOne({ role: "admin" }).select("_id");

        if (admin) {
            res.json({ success: true, adminId: admin._id });
        } else {
            // Fallback ID agar DB mein koi admin role wala nahi hai
            res.json({ success: true, adminId: "69e62e3b6198017fc525b9eb" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 2. Send Message logic
const sendMessage = async (req, res) => {
    try {
        const { message, receiverId, senderName } = req.body;
        const senderId = req.userId;

        const newMessage = new messageModel({
            senderId,
            receiverId,
            senderName,
            message
        });

        // 1. Message save karo (Yahan MongoDB _id generate karega)
        await newMessage.save();

        // 2. Success message ke saath pura object wapas bhejo
        res.json({
            success: true,
            message: "Message Sent",
            newMessage: newMessage // <--- Yeh line sabse zaroori hai
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
// 3. Get messages for a specific user-admin pair
const getMessages = async (req, res) => {
    try {
        const { userId } = req.query;

        // Dynamic Admin search to ensure we use the current admin's ID
        const admin = await User.findOne({ role: "admin" });
        const adminId = admin ? admin._id : "69e62e3b6198017fc525b9eb";

        const messages = await messageModel.find({
            $or: [
                { senderId: userId, receiverId: adminId },
                { senderId: adminId, receiverId: userId },
                { receiverId: "ADMIN_ID", senderId: userId } // For backward compatibility
            ]
        }).sort({ timestamp: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 4. Admin Side: Get all unique users who messaged the admin
const getAllChatsForAdmin = async (req, res) => {
    try {
        const adminId = req.userId; // Middleware provides the logged-in Admin's ID

        const chats = await messageModel.aggregate([
            {
                $match: {
                    $or: [
                        { receiverId: "ADMIN_ID" },
                        { receiverId: adminId },
                        { receiverId: String(adminId) }
                    ]
                }
            },
            {
                $group: {
                    _id: "$senderId",
                    senderName: { $first: "$senderName" },
                    lastMsg: { $last: "$message" },
                    timestamp: { $last: "$timestamp" }
                }
            },
            { $sort: { timestamp: -1 } }
        ]);
        res.json({ success: true, chats });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Message delete karne ka logic
 const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId; 
        const userRole = req.userRole; // Middleware se 'admin' ya 'user' aayega

        const message = await messageModel.findById(messageId);

        if (!message) {
            return res.json({ success: false, message: "Message not found" });
        }

        // --- FIXED LOGIC ---
        const isOwner = message.senderId.toString() === userId;
        const isAdmin = userRole === "admin"; // Check karein ki role 'admin' hai ya nahi

        if (isOwner || isAdmin) {
            await messageModel.findByIdAndDelete(messageId);
            return res.json({ success: true, message: "Message Deleted" });
        } else {
            return res.json({ success: false, message: "Unauthorized: Aap doosro ke msg delete nahi kar sakte!" });
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { sendMessage, getMessages, getAllChatsForAdmin, getAdminId, deleteMessage };
