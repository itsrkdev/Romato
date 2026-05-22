import orderModel from "../Models/OrderModel.js";
import userModel from "../Models/UserModel.js";
import FoodItem from "../Models/FoodItemModel.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Razorpay Instance Initialize karein
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. Initial Order Creation (Database mein data lock karne ke liye)
const placeOrder = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        
        if (user.isBlocked) {
            return res.json({ 
                success: false, 
                message: "Your account is restricted. You cannot place new orders." 
            });
        }
        
        // Frontend se aaye items ko process karo
        const orderItems = await Promise.all(req.body.items.map(async (item) => {
            const foodData = await FoodItem.findById(item._id);
            return {
                _id: item._id,
                name: foodData.name,
                price: foodData.price,
                quantity: item.quantity,
                sellerId: foodData.sellerId, 
                image: foodData.image
            }
        }));

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: orderItems, 
            amount: req.body.amount,
            address: req.body.address,
            payment: false,
            date: Date.now()
        })

        await newOrder.save();

        // Cart empty karna (Yahan order database mein lock ho chuka hai)
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Initialized", orderId: newOrder._id });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error while placing order" });
    }
}


// 2. FIXED CONTROLLER: Razorpay Token/Order ID Generator (Safe-Integer Casted)
const placeRazorpayOrder = async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        console.log("Backend par aaya hua raw amount:", amount);

        // Safety verification parameters
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.json({ success: false, message: "Invalid order amount detected" });
        }

        // 🔥 CRITICAL FIX: Math.round() aur Math.floor() se currency ko absolute strict integer banayein
        const amountInPaise = Math.round(parseFloat(amount) * 100);

        console.log("Razorpay Gateway ko bheja jaa raha exact Integer Amount:", amountInPaise);

        const options = {
            amount: amountInPaise,      // Strict Integer Format (e.g., 4500 ya 24200)
            currency: "INR",            // Strict National Route
            receipt: String(orderId),   // Local Order reference binding
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        if (!razorpayOrder) {
            return res.json({ success: false, message: "Razorpay failed to initialize" });
        }

        // Send token to frontend
        res.json({ success: true, order: razorpayOrder });

    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.json({ success: false, message: "Razorpay Gateway Error", details: error.message });
    }
};



// 3. UPGRADED CONTROLLER: Cryptographic Security ke sath Payment Verification
const verifyOrder = async (req, res) => {
    const { orderId, success, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    try {
        // Agar webhook ya client direct success verify kar raha hai signature ke sath
        if ((success === true || success === "true") && razorpay_signature) {
            
            // HMAC SHA256 verification sequence
            const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
            hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
            const generatedSignature = hmac.digest('hex');

            // 100% genuine validation check
            if (generatedSignature === razorpay_signature) {
                const updatedOrder = await orderModel.findByIdAndUpdate(
                    orderId,
                    { payment: true, status: "Placed" },
                    { new: true }
                );

                if (!updatedOrder) {
                    return res.json({ success: false, message: "Order not found" });
                }

                return res.json({ success: true, message: "Payment Verified & Order Placed Successfully!" });
            } else {
                return res.json({ success: false, message: "Tampered transaction detected. Invalid Signature." });
            }
        } else {
            // Agar payment user ne cancel kar di ya gateway fail hua, toh database order safe side clean karo
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment Failed or Cancelled" });
        }
    } catch (error) {
        console.log("Verification Error:", error);
        res.json({ success: false, message: "Error in verification" });
    }
}

// 4. Order Status Changer Admin ke liye
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
    }
}

// 5. User ke orders panel ke liye list fetcher
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
        console.log("Fetching orders for User ID:", req.body.userId);
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// 6. Multi-seller specific panel split systems
const listSellerOrders = async (req, res) => {
    try {
        const sellerId = req.userId; 
        const allOrders = await orderModel.find({ payment: true });

        const sellerSpecificOrders = allOrders.filter(order => {
            return order.items.some(item => {
                const itemSellerId = item.sellerId._id ? String(item.sellerId._id) : String(item.sellerId);
                return itemSellerId === String(sellerId);
            });
        });

        const cleanedOrders = sellerSpecificOrders.map(order => {
            const filteredItems = order.items.filter(item => {
                const itemSellerId = item.sellerId._id ? String(item.sellerId._id) : String(item.sellerId);
                return itemSellerId === String(sellerId);
            });
            return { ...order._doc, items: filteredItems };
        });

        res.json({ success: true, data: cleanedOrders });
    } catch (error) {
        console.log("Error in listSellerOrders:", error);
        res.json({ success: false, message: "Error fetching orders" });
    }
}

export { placeOrder, placeRazorpayOrder, verifyOrder, userOrders, listSellerOrders, updateStatus };






















