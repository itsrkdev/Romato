import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true } // Admin jo photo upload karega uska naam save hoga
});

// Agar model pehle se bana hai toh wahi use hoga, nahi toh naya banega
const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);
export default categoryModel;