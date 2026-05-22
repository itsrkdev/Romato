import React, { useContext } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { storeContext } from '../../context/StoreContext';

export default function FoodItem({ id, name, price, description, image, sellerName }) {

    // Context se functions aur url nikalna
    const { addToCart, cartItems, removeToCart, url } = useContext(storeContext);

    return (
        <div className='food-item'>
            <div className="foot-item-img-container">
                {/* Product Image */}
                <img className='food-item-img' src={image.includes("http") ? image : url + "/images/" + image} alt={name} />

                {/* Floating Add/Counter Button Container */}
                <div className='add-button-container'>
                    {
                        !cartItems[id]
                            ? <div className='add-btn-white' onClick={() => addToCart(id)}>
                                <p>Buy</p>
                                <span>+</span>
                            </div>
                            : <div className='food-item-counter'>
                                {/* Counter buttons */}
                                <img onClick={() => removeToCart(id)} src={assets.remove_icon_red} alt="" />
                                <p>{cartItems[id]}</p>
                                <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
                            </div>
                    }
                </div>


            </div>

            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating" />
                </div>

                <p className="food-item-desc">{description}</p>

                <div className="food-item-price-seller">
                    <p className="food-item-price">₹{price}</p>

                    {/* Seller Name Label */}
                    {sellerName && (
                        <p className="food-item-seller">
                            By <span>{sellerName}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

