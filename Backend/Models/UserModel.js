import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    blockedUntil: { type: Date, default: null },
    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user"
    },
    cartData: { type: Object, default: {} } // User ka cart save karne ke liye

}, { minimize: false });


const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User;