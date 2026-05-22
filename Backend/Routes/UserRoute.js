import express from "express";
import { loginUser, registerUser, getProfile } from "../Controllers/UserController.js";
import authMiddleware from "../Middleware/Auth.js"
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authMiddleware, getProfile);


export default userRouter;