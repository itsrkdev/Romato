import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./AddCategory.css"
import { storeContext } from '../../../context/StoreContext';

const AddCategory = ({ url }) => {
    const { categories, fetchCategories } = useContext(storeContext);
    const [image, setImage] = useState(false);
    const [name, setName] = useState("");

    // --- Edit Mode ki States ---
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState("");

    // 1. Jab koi table mein "Edit" button dabayega
    const handleEditClick = (cat) => {
        setIsEditing(true);       // Form ko update mode mein dalo
        setEditId(cat._id);       // Category ki ID save karo
        setName(cat.name);        // Input box mein purana naam daal do
        // Note: Image input ko khali rakhenge, agar admin ko image nahi badalni toh purani hi rahegi
    };

    // 2. Cancel Edit Button
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditId("");
        setName("");
        setImage(false);
    };

    // 3. Form Submit Handler (Add aur Update dono isi se handle honge)
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        if (image) {
            formData.append("image", image);
        }

        if (isEditing) {
            // ----- UPDATE CATEGORY LOGIC -----
            formData.append("id", editId); // Update ke liye ID zaroori hai
            try {
                const response = await axios.post(`${url}/api/category/update`, formData);
                if (response.data.success) {
                    toast.success(response.data.message);
                    handleCancelEdit(); // Form reset aur edit mode off
                    await fetchCategories(); // Refresh global data
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Failed to update category");
            }
        } else {
            // ----- ADD CATEGORY LOGIC (Aapka purana code) -----
            if (!image) {
                toast.error("Please upload an image");
                return;
            }
            try {
                const response = await axios.post(`${url}/api/category/add`, formData);
                if (response.data.success) {
                    setName("");
                    setImage(false);
                    toast.success(response.data.message);
                    await fetchCategories();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Failed to add category");
            }
        }
    };

    // 4. Delete Category Logic
    const handleDeleteClick = async (id) => {
        if (window.confirm("Kya aap is category ko delete karna chahte hain?")) {
            try {
                const response = await axios.post(`${url}/api/category/remove`, { id });
                if (response.data.success) {
                    toast.success(response.data.message);
                    await fetchCategories();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Failed to delete category");
            }
        }
    };

    return (
        <div className='category-container'>
            
            {/* === SECTION 1: FORM (Add/Update dono ke liye) === */}
            <div className='add-category'>
                <h2>{isEditing ? "Update Category" : "Add New Category"}</h2>
                <form onSubmit={onSubmitHandler}>
                    <div className="upload-img">
                        <p>Upload Category Image {isEditing && "(Leave empty to keep old)"}</p>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" required={!isEditing} />
                    </div>
                    <div className="add-category-name">
                        <p>Category Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Type here" required />
                    </div>
                    
                    <div className="form-action-btns">
                        <button type='submit' className='submit-btn'>{isEditing ? "SAVE" : "ADD"}</button>
                        {isEditing && <button type='button' onClick={handleCancelEdit} className='cancel-btn'>CANCEL</button>}
                    </div>
                </form>
            </div>

            <hr className="section-divider" />

            {/* === SECTION 2: LIST TABLE (Saari categories dikhane ke liye) === */}
            <div className='category-list-section'>
                <h2>All Categories</h2>
                <div className="category-table-wrapper">
                    <table className="category-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories && categories.map((cat, index) => (
                                <tr key={index}>
                                    <td><img className="cat-table-thumb" src={cat.image} alt="" /></td>
                                    <td>{cat.name}</td>
                                    <td>
                                        <div className="table-btns">
                                            <button onClick={() => handleEditClick(cat)} className="edit-btn-style">Edit</button>
                                            <button onClick={() => handleDeleteClick(cat._id)} className="delete-btn-style">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default AddCategory;
