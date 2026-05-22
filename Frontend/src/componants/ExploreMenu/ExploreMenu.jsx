import React, { useEffect, useState } from 'react';
import './ExploreMenu.css';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ExploreMenu({ category, setCategory, url }) {
    
    const [menuList, setMenuList] = useState([]);

    // Backend se dynamic category list fetch karne ka function
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/api/category/list`);
            if (response.data.success) {
                setMenuList(response.data.data); // Database se aayi array state mein save ho gayi
            } else {
                toast.error("Categories load nahi ho payi");
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    useEffect(() => {
        if (url) {
            fetchCategories();
        }
    }, [url]); // Dependency array mein url daalna sahi practice hai

    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Explore our menu</h1>
            <p className='explore-menu-text'>
                Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
            </p>
            <div className="explore-menu-list">
                {menuList.length > 0 ? (
                    menuList.map((item, index) => {
                        return (
                            <div 
                                onClick={() => setCategory(prev => prev === item.name ? 'All' : item.name)} 
                                key={index} 
                                className='explore-menu-list-item'
                            >
                                <img 
                                    className={category === item.name ? "Active" : ""} 
                                    src={item.image} // FIX: Ab direct item.image use hoga kyunki isme Cloudinary ka full link hai
                                    alt={item.name} 
                                />
                                <p>{item.name}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>Loading categories...</p>
                )}
            </div>
            <hr />
        </div>
    );
}

