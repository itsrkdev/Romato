import express from "express";
// import { placeOrder, verifyOrder, userOrders, listSellerOrders,updateStatus} from "../Controllers/orderController.js";
import { placeOrder, placeRazorpayOrder, verifyOrder, userOrders, listSellerOrders, updateStatus } from '../Controllers/orderController.js';
import authMiddleware from '../Middleware/Auth.js'

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/razorpay", authMiddleware, placeRazorpayOrder); // <-- Yeh naya endpoint hai jo frontend dhund raha hai
orderRouter.post("/verify", authMiddleware, verifyOrder);

orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/sellerorders", authMiddleware, listSellerOrders);
orderRouter.post("/status", authMiddleware, updateStatus);






export default orderRouter;