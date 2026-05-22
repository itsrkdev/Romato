import express from "express";
import {
    getDashboardData,
    getAllSellers,
    removeSeller,
    blockSeller,
    unblockSeller,
    getAllOrders,
    getAllUsers,
    removeUser,
    blockUser,
    unblockUser

} from "../Controllers/adminController.js";
import authMiddleware from "../Middleware/Auth.js";

const adminRouter = express.Router();

adminRouter.get("/dash", authMiddleware, getDashboardData);
adminRouter.get("/allsellers", authMiddleware, getAllSellers);
adminRouter.get("/remove-seller", authMiddleware, removeSeller);
adminRouter.post("/block-seller", authMiddleware, blockSeller);
adminRouter.post("/unblock-seller", authMiddleware, unblockSeller);
adminRouter.get("/all-orders", authMiddleware, getAllOrders);
adminRouter.get("/all-users", authMiddleware, getAllUsers);
adminRouter.post("/remove-user", authMiddleware, removeUser);
adminRouter.post("/block-user", authMiddleware, blockUser);
adminRouter.post("/unblock-user", authMiddleware, unblockUser);



export default adminRouter;