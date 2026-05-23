import React, { useContext } from 'react'
import "./FoodDisplay.css"
import FoodItem from '../FoodItem/FoodItem.jsx';
import FoodSkeleton from '../FoodItem/FoodSkeleton.jsx'; // 1. Skeleton import kiya
import { storeContext } from '../../context/StoreContext';

export default function FoodDisplay({ category }) {

    // 2. Context se food_list ke sath 'loading' state bhi nikal lein
    const { food_list, loading } = useContext(storeContext);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">

                {/* 3. Agar loading true hai, toh 8 skeleton cards dikhao */}
                {loading ? (
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <FoodSkeleton key={n} />)
                ) : (
                    // Agar loading khatam ho gayi, toh asli food_list dikhao
                    food_list?.map((item) => {
                        if (category === 'All' || category === item.category) {
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
                        }
                        return null;
                    })
                )}
            </div>
        </div>
    )
}


