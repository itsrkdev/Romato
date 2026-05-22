
import React, { useState, useContext } from 'react';
import './ManageCategory.css';
import { storeContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageCategory = () => {
    const { url, categories, fetchCategories } = useContext(storeContext);
    
    // States for Editing
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState("");
    const [editName, setEditName] = useState("");
    const [editImage, setEditImage] = useState(false);

    // Edit button click hone par form fill karne ke liye
    const handleEditClick = (category) => {
        setEditMode(true);
        setEditId(category._id);
        setEditName(category.name);
    };

    // Update handler submit function
    const onUpdateHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", editId);
        formData.append("name", editName);
        if (editImage) {
            formData.append("image", editImage);
        }

        try {
            const response = await axios.post(`${url}/api/category/update`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                setEditMode(false);
                setEditImage(false);
                await fetchCategories(); // Bina refresh ke list update hogi
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    // Delete Category Function (Extra Feature)
    const deleteCategory = async (id) => {
        if(window.confirm("Kya aap sach me ye category delete karna chahte hain?")) {
            try {
                const response = await axios.post(`${url}/api/category/remove`, { id });
                if (response.data.success) {
                    toast.success(response.data.message);
                    await fetchCategories();
                }
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    return (
        <div className='manage-category'>
            <h2>Manage Categories</h2>

            {/* --- 1. EDIT/UPDATE FORM (Sirf tab dikhega jab Edit click hoga) --- */}
            {editMode && (
                <form onSubmit={onUpdateHandler} className="edit-form-box">
                    <h3>Update Category</h3>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required placeholder="Category Name" />
                    <input type="file" onChange={(e) => setEditImage(e.target.files[0])} />
                    <div className="form-buttons">
                        <button type="submit" className="save-btn">Save Changes</button>
                        <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                </form>
            )}

            {/* --- 2. CATEGORY LIST TABLE --- */}
            <div className="category-table-wrapper">
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => (
                            <tr key={index}>
                                <td><img src={cat.image} alt={cat.name} className="table-img" /></td>
                                <td>{cat.name}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEditClick(cat)}>Edit</button>
                                    <button className="delete-btn" onClick={() => deleteCategory(cat._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageCategory;