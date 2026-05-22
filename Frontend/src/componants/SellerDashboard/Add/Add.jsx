import React, { useState, useContext, useEffect } from 'react'
import './Add.css'
import { assets } from '../../../assets/assets'
import axios from "axios"
import { storeContext } from '../../../context/StoreContext';
import { toast } from 'react-toastify'

const Add = ({ url }) => {

    const {categories, fetchFoodList,fetchCategories} = useContext(storeContext);
    const [image, setImage] = useState(false);
    // const [categories, setCategories] = useState([]); // 1. Backend se aane wali categories save karne ke liye state

    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "" // 2. Default value empty string rakhi hai taaki dynamic data load hone par pehli category select ho sake
    });

    // 4. Component load hote hi categories call honi chahiye

    useEffect(() => {
    if (url) {
        fetchCategories(); // Pehli baar load hone par

        // Jab bhi seller is tab par wapas aayega (window focus hogi), data auto refresh hoga
        const handleFocus = () => {
            fetchCategories();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }
}, [url]);


// 3. Ek chota sa useEffect aur jod lijiye taaki jaise hi categories load hon, dropdown mein pehla item auto-select ho jaye (Bina crash ke)
    useEffect(() => {
        if (categories && categories.length > 0 && !data.category) {
            setData(prev => ({ ...prev, category: categories[0].name }));
        }
    }, [categories]);
    // useEffect(() => {
    //     if (url) {
    //         fetchCategories();
    //     }
    // }, [url]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);

        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(`${url}/api/food/add`, formData, { headers: { token } });
            if (response.data.success) {
                fetchFoodList();
                // Reset karte waqt pehli category ko hi select rakhein
                setData({ 
                    name: "", 
                    description: "", 
                    price: "", 
                    category: categories.length > 0 ? categories[0].name : "" 
                });
                setImage(false);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to add product");
        }
    }

    return (
        <div className='add'>
            <form className='add-form' onSubmit={onSubmitHandler}>
                <h2 className="form-title">Add New Item</h2>
                
                <div className="add-img-upload flex-col">
                    <p className="label-text">Upload Image</p>
                    <label htmlFor="image">
                        <img className="upload-preview" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>

                <div className="add-product-name flex-col">
                    <p className="label-text">Product name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here...' required />
                </div>

                <div className="add-product-description flex-col">
                    <p className="label-text">Product description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="5" placeholder='Write content here...' required></textarea>
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p className="label-text">Category</p>
                        <select onChange={onChangeHandler} name="category" value={data.category}>
                            {/* 5. Hardcoded options hata kar backend se loop chala diya */}
                            {categories.length > 0 ? (
                                categories.map((cat, index) => (
                                    <option key={index} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))
                            ) : (
                                <option value="">No Category Available</option>
                            )}
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p className="label-text">Price (₹)</p>
                        <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='₹20' required />
                    </div>
                </div>

                <button type='submit' className='add-btn'>ADD ITEM</button>
            </form>
        </div>
    )
}

export default Add
