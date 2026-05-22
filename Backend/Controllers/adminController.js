import orderModel from "../Models/OrderModel.js";
import userModel from "../Models/UserModel.js";

const getDashboardData = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments({ payment: true });
        const totalUsers = await userModel.countDocuments({ role: "user" });
        const totalSellers = await userModel.countDocuments({ role: "seller" });

        const orders = await orderModel.find({ payment: true });
        const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

        const recentOrders = await orderModel.find({ payment: true })
            .sort({ date: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: { totalOrders, totalUsers, totalSellers, totalRevenue },
            recentOrders
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Saare Sellers ki list nikalne ke liye
// adminController.js

const getAllSellers = async (req, res) => {
    try {
        // 1. Saare sellers fetch karo
        const sellers = await userModel.find({ role: "seller" }).select("-password");

        // 2. Saare orders fetch karo (Taaki hum calculate kar sakein)
        const allOrders = await orderModel.find({});

        const sellersWithStats = sellers.map((seller) => {
            const sellerIdStr = seller._id.toString();

            // 3. Filter: Wo orders jinme is seller ka kam se kam ek item ho
            const sellerOrders = allOrders.filter(order =>
                order.items.some(item => item.sellerId && item.sellerId.toString() === sellerIdStr)
            );

            // 4. Revenue Calculation: Sirf is seller ke items ka price total karo
            const totalRevenue = sellerOrders.reduce((sum, order) => {
                // 1. Pehle us seller ke saare items ka total nikaalo
                const sellerItemsTotal = order.items
                    .filter(item => item.sellerId && item.sellerId.toString() === sellerIdStr)
                    .reduce((itemSum, item) => {
                        const price = Number(item.price) || 0;
                        const qty = Number(item.quantity) || 1;
                        return itemSum + (price * qty);
                    }, 0);

                // 2. Agar is order mein is seller ka item hai, toh ₹40 delivery charge add karo
                // (Note: Agar ek order mein sirf isi seller ka saaman hai toh ₹40 add karna sahi hai)
                const deliveryCharge = 40;

                return sum + sellerItemsTotal + deliveryCharge;
            }, 0);

            return {
                ...seller._doc,
                orderCount: sellerOrders.length,
                totalEarnings: totalRevenue
            };
        });

        res.json({ success: true, data: sellersWithStats });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching admin stats" });
    }
}


// Kisi seller ko remove karne ke liye
const removeSeller = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Seller Removed Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing seller" });
    }
}
// block seller 
const blockSeller = async (req, res) => {
    try {
        const { id, days } = req.body;

        // Block hone ka waqt calculate karein
        const unblockDate = new Date();
        unblockDate.setDate(unblockDate.getDate() + parseInt(days));

        await userModel.findByIdAndUpdate(id, {
            isBlocked: true,
            blockedUntil: unblockDate
        });

        res.json({ success: true, message: `Seller blocked for ${days} days` });
    } catch (error) {
        res.json({ success: false, message: "Error blocking seller" });
    }
}

// unblock seller 
const unblockSeller = async (req, res) => {
    try {
        const { id } = req.body;
        await userModel.findByIdAndUpdate(id, {
            isBlocked: false,
            blockedUntil: null
        });
        res.json({ success: true, message: "Seller Unblocked Successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error unblocking seller" });
    }
}

// Poore system ke orders fetch karne ke liye
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching all orders" });
    }
}

// Saare normal Users ki list nikalne ke liye
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({ role: "user" }).select("-password");
        res.json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching users" });
    }
}

// Kisi user ko remove karne ke liye
const removeUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "User Deleted Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing user" });
    }
}

// User ko block karne ke liye
const blockUser = async (req, res) => {
    try {
        const { id } = req.body;
        await userModel.findByIdAndUpdate(id, { isBlocked: true });
        res.json({ success: true, message: "User Blocked Successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error blocking user" });
    }
}

// User ko unblock karne ke liye
const unblockUser = async (req, res) => {
    try {
        const { id } = req.body;
        await userModel.findByIdAndUpdate(id, { isBlocked: false });
        res.json({ success: true, message: "User Unblocked Successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error unblocking user" });
    }
}


export {
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

};
