import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({

    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    // Bina brackets ke Date.now likhein
    date: { type: Date, default: Date.now }, 
    payment: { type: Boolean, default: false }
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;