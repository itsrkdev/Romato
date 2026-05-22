import 'dotenv/config'
import mongoose from "mongoose";
import FoodItem from "../Models/FoodItemModel.js";
import orderModel from "../Models/OrderModel.js";
import UserModel from "../Models/UserModel.js"
import jwt from "jsonwebtoken";
import fs from 'fs';
import { cloudinary } from "../config/cloudinary.js";

const addFood = async (req, res) => {
    try {

        let image_url = req.file.path;

        if (req.userRole !== 'seller' && req.userRole !== 'admin') {
            return res.json({ success: false, message: "Only sellers/admin can add food" });
        }

        if (!req.file) {
            return res.json({ success: false, message: "Image not uploaded" });
        }

        const seller = await UserModel.findById(req.userId);

        if (seller.isBlocked) {
            return res.json({
                success: false,
                message: "Aapka account restricted hai. Aap naya item add nahi kar sakte."
            });
        }




        const food = new FoodItem({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            image: image_url,
            sellerId: req.userId
        });

        await food.save();
        console.log("4. Successfully saved to MongoDB");
        res.json({ success: true, message: "Food Added Successfully" });

    } catch (error) {
        console.log("CRITICAL ERROR:", error.message); // Yeh line terminal mein check karein
        res.json({ success: false, message: error.message }); // Error message frontend par bhi dikhega
    }
}

// Optimized List Food Logic
const listFood = async (req, res) => {
    try {
        // const { token } = req.headers;


        // Yeh line sabse best hai headers read karne ke liye
        const token = req.headers.token || req.headers['token'];
        console.log("Header Token:", token);

        if (token) {
            try {
                const decode = jwt.verify(token, process.env.JWT_SECRET);

                // 1. Admin Logic: Sab dikhao + Seller ka name bhi saath lao
                if (decode.role === 'admin') {
                    const foods = await FoodItem.find({}).populate('sellerId', 'name');
                    return res.json({ success: true, data: foods });
                }

                // 2. Seller Logic: Sirf uska product + Uska name (verification ke liye)
                if (decode.role === 'seller') {
                    const foods = await FoodItem.find({ sellerId: decode.id }).populate('sellerId', 'name');
                    return res.json({ success: true, data: foods });
                }
            } catch (jwtErr) {
                console.log("Token invalid, public view showing");
            }
        }

        // 3. User/Guest Logic: Sab dikhao + Seller ka name display karne ke liye
        const foods = await FoodItem.find({}).populate('sellerId', 'name');
        res.json({ success: true, data: foods });

    } catch (error) {
        console.log("Error:", error.message);
        res.json({ success: false, message: "Error fetching list" });
    }
}

// 2. Dish delete karne ke liye

const removeFood = async (req, res) => {
    try {
        const { id } = req.body;

        const seller = await UserModel.findById(req.userId);

        if (seller.isBlocked) {
            return res.json({
                success: false,
                message: "Aapka account restricted hai. Aap item delete nahi kar sakte."
            });
        }

        // 1. Pehle database mein item dhoondein
        const food = await FoodItem.findById(id);

        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // 2. Image ko folder se delete karein (Error handling ke saath)
        if (food.image) {
            const imagePath = `uploads/${food.image}`;
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.log("File delete error:", err.message);
                });
            }
        }

        // 3. Database se delete karein
        await FoodItem.findByIdAndDelete(id);

        res.json({ success: true, message: "Food Removed Successfully" });

    } catch (error) {
        console.log("Delete Error Details:", error); // Terminal mein error check karne ke liye
        res.json({ success: false, message: "Server error during deletion" });
    }
}

// 3. Edit (Update) karne ke liye

const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category } = req.body;

        const seller = await UserModel.findById(req.userId);

        if (seller.isBlocked) {
            return res.json({
                success: false,
                message: "Aapka account restricted hai. Aap naya item add nahi kar sakte."
            });
        }

        if (!id || id === "undefined") {
            return res.json({ success: false, message: "Backend did not receive ID" });
        }

        // 1. Purana data dhoondein
        const food = await FoodItem.findById(id);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        let updateData = { name, description, price: Number(price), category };

        // 2. Agar nayi image aayi hai toh Cloudinary par handle karein
        if (req.file) {
            // Cloudinary image URL se public_id nikalna padta hai delete karne ke liye
            if (food.image && food.image.includes("cloudinary")) {
                try {
                    // URL se public_id nikalne ka logic: folder_name/image_name
                    const publicId = food.image.split('/').pop().split('.')[0];
                    const folderPath = "food_items/"; // Jo folder aapne config mein rakha hai
                    await cloudinary.uploader.destroy(folderPath + publicId);
                } catch (delErr) {
                    console.log("Old Image Delete Error:", delErr);
                }
            }

            // Nayi image ka Cloudinary URL updateData mein daalein
            updateData.image = req.file.path;
        }

        // 3. Database update karein
        await FoodItem.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Food Updated Successfully" });

    } catch (error) {
        console.log("Update Error:", error.message);
        res.json({ success: false, message: "Error updating food" });
    }
}


const sellerDashboard = async (req, res) => {
    try {
        const sellerId = req.body.userId;

        // 1. Query: payment check testing ke liye hata dein agar data nahi dikh raha
        const orders = await orderModel.find({
            "items.sellerId": { $in: [sellerId, new mongoose.Types.ObjectId(sellerId)] },
            payment: true  // <--- Ye line add karne se unpaid orders filter ho jayenge
        });

        console.log("Dashboard Debug - Seller ID:", sellerId);
        console.log("Dashboard Debug - Orders Found:", orders.length);

        let totalRevenue = 0;
        let sellerOrdersCount = 0;

        orders.forEach(order => {
            let isThisSellerOrder = false;
            let orderSubtotal = 0;

            order.items.forEach(item => {
                // String comparison safety ke liye
                if (String(item.sellerId) === String(sellerId)) {
                    orderSubtotal += Number(item.price) * Number(item.quantity);
                    isThisSellerOrder = true;
                }
            });

            if (isThisSellerOrder) {
                // toh totalRevenue mein items ka price + 40 delivery charge add karo
                totalRevenue += orderSubtotal + 40;

                sellerOrdersCount++;
            }
        });

        // Active Products ke liye FoodItem model use karein
        const totalProducts = await FoodItem.countDocuments({ sellerId: sellerId });

        res.json({
            success: true,
            stats: {
                totalRevenue,
                totalOrders: sellerOrdersCount,
                totalProducts
            }
        });

    } catch (error) {
        console.log("Dashboard Error:", error);
        res.json({ success: false, message: "Error loading dashboard stats" });
    }
}

export { addFood, listFood, removeFood, updateFood, sellerDashboard };