import userModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Token banane ka function
const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET);
};

// User Register
const registerUser = async (req, res) => {
    const { name, email, password, role, adminSecretKey } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Password hash karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🛡️ SECURITY LAYER FOR ADMIN ROLE
        let assignedRole = role || "user";

        if (role === "admin") {
            // Agar bheji gayi key empty hai ya match nahi karti (.env file se)
            if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
                return res.json({
                    success: false,
                    message: "Bhai galat security key hai! You cannot register as an Admin."
                });
            }
            assignedRole = "admin";
        }


        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role: assignedRole, // 🔥 Strict role validation ke sath bind kiya // Default user, par hum 'seller' bhi bhej sakte hain
            message: "User registered successfully!" // Yeh line add karein
        });

        const user = await newUser.save();
        const token = createToken(user._id, user.role);
        res.json({ success: true, token, role: user.role });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// User Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });


        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id, user.role);
        res.json({
            success: true,
            token,
            name: user.name,
            role: user.role,
            message: "User Login successfully!"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// UserController.js
const getProfile = async (req, res) => {
    try {
        // Sabse important line: Dono jagah check karo
        const userId = req.userId || req.body?.userId;

        // Debugging ke liye terminal mein check karein
        console.log("Controller received UserID:", userId);

        if (!userId) {
            return res.json({ success: false, message: "Authorized ID not found. Please login again." });
        }

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User details not found in Database" });
        }

        res.json({ success: true, data: user });

    } catch (error) {
        console.log("GetProfile Error:", error.message);
        res.json({ success: false, message: "Server Error" });
    }
}

export { loginUser, registerUser, getProfile };