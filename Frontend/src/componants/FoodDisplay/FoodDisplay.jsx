import React, { useContext } from 'react'
import "./FoodDisplay.css"
import FoodItem from '../FoodItem/FoodItem.jsx';
import FoodSkeleton from '../FoodItem/FoodSkeleton.jsx'; 
import { storeContext } from '../../context/StoreContext';

export default function FoodDisplay({ category }) {

    // Context se food_list aur loading ke sath 'search' bhi nikal liya
    const { food_list, loading, search } = useContext(storeContext);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">

                {/* Agar loading true hai, toh skeleton cards dikhao */}
                {loading ? (
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <FoodSkeleton key={n} />)
                ) : (
                    // map karne se pehle search aur category dono ka filter lagaya
                    food_list?.[0] ? (
                        food_list
                            .filter((item) => {
                                // 1. Category filter (jo pehle se tha)
                                const matchesCategory = category === 'All' || category === item.category;
                                
                                // 2. Search filter (dish ke name ko lowercase karke match karega)
                                const matchesSearch = item.name.toLowerCase().includes((search || "").toLowerCase());
                                
                                return matchesCategory && matchesSearch;
                            })
                            .map((item) => {
                                return (
                                    <FoodItem
                                        key={item._id}
                                        id={item._id}
                                        name={item.name}
                                        description={item.description}
                                        price={item.price}
                                        image={item.image}
                                        sellerName={item.sellerId?.name}
                                    />
                                )
                            })
                    ) : null
                )}
            </div>
            
            {/* Ek chota sa user experience detail: Agar filter karne ke baad koi item na mile */}
            {!loading && food_list?.filter(item => (category === 'All' || category === item.category) && item.name.toLowerCase().includes((search || "").toLowerCase())).length === 0 && (
                <p style={{ textAlign: 'center', width: '100%', color: '#7f8c8d', margin: '20px 0' }}>
                    Swaadist cheez nahi mili! Kuch aur search karke dekhein. 🔍
                </p>
            )}
        </div>
    )
}


