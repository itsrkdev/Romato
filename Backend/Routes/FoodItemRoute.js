import express from "express";
import { listFood, addFood, removeFood, updateFood, sellerDashboard } from "../Controllers/FoodController.js";
import multer from "multer";
import authMiddleware from "../Middleware/Auth.js";
import { upload } from "../config/cloudinary.js"
const FoodRouter = express.Router();


FoodRouter.get("/list", listFood); // Get request for listing
FoodRouter.post("/add", authMiddleware, upload.single("image"), addFood); // Data DALNE ke liye
FoodRouter.post("/remove", authMiddleware, removeFood);
FoodRouter.post("/update", authMiddleware, upload.single("image"), updateFood);
FoodRouter.get("/dash", authMiddleware, sellerDashboard);

export default FoodRouter;