import mongoose from "mongoose";


const FoodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Multer/Cloudinary se aane wala file name
    category: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Konsa seller ye dish bech raha hai
});

// 'models' (plural and lowercase) use karein
const FoodItem = mongoose.models.FoodItem || mongoose.model("FoodItem", FoodItemSchema);

export default FoodItem;