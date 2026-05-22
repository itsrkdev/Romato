import express from "express";
import { addCategory, listCategory, updateCategory } from "../Controllers/categoryController.js";
import multer from "multer";
import { upload } from "../config/cloudinary.js";

const categoryRouter = express.Router();


categoryRouter.post("/add", upload.single("image"), addCategory);
categoryRouter.get("/list", listCategory);
categoryRouter.post("/update", upload.single("image"), updateCategory);

export default categoryRouter;