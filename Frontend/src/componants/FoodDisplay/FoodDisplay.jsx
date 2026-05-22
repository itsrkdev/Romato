import React, { useContext } from 'react'
import "./FoodDisplay.css"
import FoodItem from '../FoodItem/FoodItem.jsx';
import { storeContext } from '../../context/StoreContext';

export default function FoodDisplay({ category }) {

    // Context se food_list ke saath url bhi nikal lein (agar FoodItem ko chahiye)
    const { food_list } = useContext(storeContext);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list?.map((item) => { // 'index' ki zaroorat nahi agar '_id' hai
                    if (category === 'All' || category === item.category) {
                        return (
                            <FoodItem 
                                key={item._id}  // Index ki jagah _id use karein
                                id={item._id} 
                                name={item.name} 
                                description={item.description} 
                                price={item.price} 
                                image={item.image} 
                                sellerName ={item.sellerId?.name}
                            />
                        )
                    }
                    return null; // Map mein hamesha kuch return karna achha hota hai
                })}
            </div>
        </div>
    )
}

