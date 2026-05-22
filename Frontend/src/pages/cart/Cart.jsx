import React, { useContext, useEffect } from 'react'
import "./Cart.css"
import { storeContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


export default function Cart() {
  const { cartItems, food_list, token, removeToCart, getTotalCartAmount, url, userData, loadUserData } = useContext(storeContext);
  let navigate = useNavigate();

  // --- 1. Items ko Seller ID ke hisaab se group karne ka logic (Name ke saath) ---
  const groupedItems = food_list.reduce((acc, item) => {
    if (cartItems[item._id] > 0) {
      const sId = item.sellerId?._id?.toString() || item.sellerId?.toString() || "Unknown";

      // Seller Name nikaalein
      const sName = item.sellerId?.name || item.sellerName || "Unknown Store";

      if (!acc[sId]) {
        acc[sId] = {
          name: sName,
          items: []
        };
      }
      acc[sId].items.push(item);
    }
    return acc;
  }, {});


  // Cart.jsx ke andar
  useEffect(() => {
    // Local storage se fresh token uthao
    const localToken = localStorage.getItem("token");

    if (localToken) {
      loadUserData(localToken);
    } else if (token) {
      loadUserData(token);
    }
  }, [token]);


  useEffect(() => {
    // Page load par fetch karo
    if (token) {
      loadUserData(token);
    }

    // Jab user window tab par wapas aaye tab check karo
    const handleFocus = () => {
      if (token) {
        loadUserData(token);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [token]);





  const handleCheckout = async (sellerId) => {

     await loadUserData(token);
    // 1. Agar data abhi load ho raha hai (null hai)
    if (userData === null) {
      toast.info("Verifying your account status, please wait...");
      return;
    }

    // 2. Strict Check (Sirf tab roko jab confirm ho ki blocked hai)
    const isBlocked = userData.isBlocked === true || userData.isBlocked === "true";

    if (isBlocked) {
      toast.error("Access Denied! Your account is restricted.");
      return;
    }

    // 3. Agar blocked nahi hai toh aage badho
    navigate('/order', { state: { sellerId: sellerId } });
  };

  return (
    <div className='cart'>
      <div className="cart-item">
        {Object.keys(groupedItems).length === 0 ? (
          <h2 style={{ textAlign: 'center', padding: '50px' }}>Your Cart is Empty</h2>
        ) : (
          Object.keys(groupedItems).map((sellerId) => (
            <div key={sellerId} className="seller-section" style={{ marginBottom: "40px", border: "1px solid #eee", padding: "15px", borderRadius: "8px" }}>

              {/* --- Yahan Seller Name Dikhega --- */}
              <h3 style={{ color: "tomato", textTransform: "capitalize", marginBottom: "15px" }}>
                Seller : {groupedItems[sellerId].name}
              </h3>

              <div className="cart-items-tittle">
                <p>Item</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
              </div>
              <br /><hr />

              {/* YAHAN CHANGE KIYA HAI: groupedItems[sellerId].items par map chalega */}
              {groupedItems[sellerId].items.map((item) => (
                <div key={item._id}>
                  <div className='cart-items-tittle cart-items-item'>
                    <img
                      src={item.image.startsWith("http") ? item.image : `${url}/images/${item.image}`}
                      alt={item.name}
                    />
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>₹{item.price * cartItems[item._id]}</p>
                    <p onClick={() => removeToCart(item._id)} className='cross'>X</p>
                  </div>
                  
                  <hr />
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  className="seller-checkout-btn"
                  style={{
                    background: (userData?.isBlocked === true || userData?.isBlocked === "true") ? "gray" : "tomato",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    opacity: (userData === null) ? 0.7 : 1 // Load hote waqt thoda light dikhega
                  }}
                  onClick={() => handleCheckout(sellerId)}
                >
                  {/* Conditional Text: Data loading hai toh 'Checking' dikhao */}
                  {userData === null
                    ? "VERIFYING..."
                    : (userData?.isBlocked === true || userData?.isBlocked === "true")
                      ? "ACCOUNT RESTRICTED"
                      : `CHECKOUT FROM ${groupedItems[sellerId].name.toUpperCase()}`
                  }
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Overall Cart Summary</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal (All Items)</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹ {getTotalCartAmount() === 0 ? 0 : 40}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Grand Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
