import categoryModel from "../Models/categoryModel.js";

// 1. Database mein Category Add Karne Ke Liye
const addCategory = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Image upload nahi hui!" });
        }

        // Cloudinary ka live URL yahan se milega
        let image_url = req.file.path;

        const category = new categoryModel({
            name: req.body.name,
            image: image_url // Database mein pura live link save hoga
        });

        await category.save();
        res.json({ success: true, message: "Category Added Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding category" });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    try {
        const { id, name } = req.body;
        let updateData = { name };

        // Agar nayi image upload ki hai, toh uska path ya cloudinary url update karein
        if (req.file) {
            // Agar cloudinary use kar rahe hain toh req.file.path hoga, local file hai toh req.file.filename
            updateData.image = req.file.path || req.file.filename;
        }

        await categoryModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Category Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating category" });
    }
};

// 2. Fetch Karne Ke Liye (Yeh same rahega)
const listCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.json({ success: true, data: categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching categories" });
    }
};

export { addCategory, listCategory, updateCategory };
