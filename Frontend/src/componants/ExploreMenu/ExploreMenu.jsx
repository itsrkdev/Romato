import React, { useEffect, useState } from 'react';
import './ExploreMenu.css';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ExploreMenu({ category, setCategory, url }) {
    
    const [menuList, setMenuList] = useState([]);
    const [loading, setLoading] = useState(true); // 1. Loading state add ki

    // Backend se dynamic category list fetch karne ka function
    const fetchCategories = async () => {
        try {
            setLoading(true); // Fetch shuru hone par loading true
            const response = await axios.get(`${url}/api/category/list`);
            if (response.data.success) {
                setMenuList(response.data.data); 
            } else {
                toast.error("Categories load nahi ho payi");
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false); // Fetch poora hone par loading false
        }
    };

    useEffect(() => {
        if (url) {
            fetchCategories();
        }
    }, [url]);

    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Explore our menu</h1>
            <p className='explore-menu-text'>
                Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
            </p>
            
            <div className="explore-menu-list">
                {/* 2. Agar loading hai, toh chamakte hue Skeleton circles dikhao */}
                {loading ? (
                    [1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div className="explore-menu-skeleton-item" key={n}>
                            <div className="skeleton-circle menu-shimmer"></div>
                            <div className="skeleton-text menu-shimmer"></div>
                        </div>
                    ))
                ) : menuList.length > 0 ? (
                    menuList.map((item, index) => {
                        return (
                            <div 
                                onClick={() => setCategory(prev => prev === item.name ? 'All' : item.name)} 
                                key={index} 
                                className='explore-menu-list-item'
                            >
                                <img 
                                    className={category === item.name ? "Active" : ""} 
                                    src={item.image} 
                                    alt={item.name} 
                                />
                                <p>{item.name}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No categories found.</p>
                )}
            </div>
            <hr />
        </div>
    );
}

