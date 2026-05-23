import React from 'react';
import './FoodItem.css'; // Hum FoodItem ki CSS use karenge layout ke liye

export default function FoodSkeleton() {
    return (
        <div className='food-item skeleton-active'>
            <div className="foot-item-img-container">
                {/* Chamakta hua image box */}
                <div className='food-item-img food-shimmer-bg'></div>
            </div>

            <div className="food-item-info">
                {/* Title aur Rating ka chamakta hua box */}
                <div className="food-item-name-rating">
                    <div className="food-shimmer-bg skeleton-title"></div>
                    <div className="food-shimmer-bg skeleton-rating"></div>
                </div>

                {/* Description ki lines */}
                <div className="food-shimmer-bg skeleton-desc-1"></div>
                <div className="food-shimmer-bg skeleton-desc-2"></div>

                {/* Price aur Seller */}
                <div className="food-item-price-seller">
                    <div className="food-shimmer-bg skeleton-price"></div>
                    <div className="food-shimmer-bg skeleton-seller"></div>
                </div>
            </div>
        </div>
    );
}
