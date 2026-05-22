import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify"
import { useContext } from 'react';
import { storeContext } from '../../../context/StoreContext';

const List = ({ url }) => {

  const { fetchFoodList, userData } = useContext(storeContext);
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ id: "", name: "", price: "", category: "", description: "" });

  const token = localStorage.getItem("token");

  // 1. Fetch List
  // List.jsx (Admin/Seller Dashboard)
  const fetchList = async () => {
    try {
      const token = localStorage.getItem("token"); // Token nikalen

      // Console karke check karein ki kya token mil raha hai?
      console.log("Token being sent:", token);

      const response = await axios.get(`${url}/api/food/list`, {
        headers: { token: token } // Yahan token bhejna zaroori hai
      });

      if (response.data.success) {
        setList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  }

  // 2. Remove Food (Yeh missing tha aapke code mein)
  const removeFood = async (foodId) => {
    // 1. Frontend check (Already good)
    if (userData && userData.isBlocked) {
      toast.error("Account Restricted! You cannot delete items.");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/food/remove`,
        { id: foodId },
        { headers: { token } }
      );

      console.log("Server Response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchFoodList();
        fetchList();
      } else {
        // YAHAN Galti thi! Success false hone par ye chalega
        // Backend se jo "Aapka account restricted hai" message aaya hai, wo yahan dikhega
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting food");
    }
  };


  // 3. Edit Handler
  const handleEdit = (item) => {
    setEditData({
      _id: item._id, // underscore laga dein
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      image: item.image // Purani image ka naam bhi rakh lein preview ke liye
    });
    setEditMode(true);
  }


  // 4. Update API Call
  const updateFood = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // SABSE PEHLE: Text data append karein
      const finalId = editData.id || editData._id;
      formData.append("id", finalId);
      formData.append("name", editData.name);
      formData.append("description", editData.description);
      formData.append("price", Number(editData.price));
      formData.append("category", editData.category);

      // BAAD MEIN: File append karein
      if (editData.image instanceof File) {
        formData.append("image", editData.image);
      }

      // DEBUG: Check karein ki browser bhej kya raha hai
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post(`${url}/api/food/update`, formData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Updated Successfully");
        setEditMode(false);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Axios Error:", error);
      toast.error("Update fail ho gaya!");
    }
  }




  useEffect(() => { fetchList() }, [])

  console.log(list)

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>

      {editMode && (
        <div className="edit-modal">
          <div className="modal-content">
            <h3>Edit Food Item</h3>
            <form onSubmit={updateFood}>

              <div className="modal-img-upload">
                <p>Update Image (Optional)</p>
                <label htmlFor="edit-image">
                  {/* Agar nayi image select ki hai toh uska preview dikhao, warna purani image dikhao */}
                  <img
                    src={editData.image instanceof File ? URL.createObjectURL(editData.image) : `${url}/images/${editData.image}`}
                    alt="Food Preview"
                    style={{ width: "100px", cursor: "pointer", borderRadius: "8px" }}
                  />
                </label>
                <input
                  type="file"
                  id="edit-image"
                  onChange={(e) => setEditData({ ...editData, image: e.target.files[0] })}
                  hidden
                />
              </div>


              <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder='Name' required />
              <input type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} placeholder='Price' required />
              <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder='Description' required />
              <div className="modal-btns">
                <button type="submit" className='update-btn'>Save Changes</button>
                <button type="button" onClick={() => setEditMode(false)} className='cancel-btn'>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="list-table">
        <div className="list-table-format-seller title">
          <b>Image</b><b>Name</b><b>Category</b><b>Price</b><b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format-seller'>
            <img src={item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <div className='action-btns'>
              <b onClick={() => handleEdit(item)} className='cursor edit-icon'>✎</b>
              <b onClick={() => removeFood(item._id)} className='cursor delete-icon'>X</b>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List;