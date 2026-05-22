import React, { useContext, useEffect, useState } from 'react'
import "./PlaceOrder.css"
import { storeContext } from '../../context/StoreContext'
import { useNavigate, useLocation } from 'react-router-dom' // useLocation add kiya
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PlaceOrder() {

  // getSellerSpecificTotal ko context se nikalo
  const { userData,getTotalCartAmount, getSellerSpecificTotal, token, food_list, cartItems, url } = useContext(storeContext);
  const navigate = useNavigate();
  const location = useLocation(); // Location hook use kiya

  // Cart page se bheji gayi sellerId pakdo
  const sellerId = location.state?.sellerId;

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  // Agar koi sellerId nahi hai toh wapas cart pe bhejo
  useEffect(() => {
    if (!sellerId) {
      toast.error("Please checkout from the cart first");
      navigate('/cart');
    }
  }, [sellerId]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  // Sirf selected seller ke items ka total
  const currentSubtotal = getSellerSpecificTotal(sellerId);
  const deliveryFee = currentSubtotal === 0 ? 0 : 40;
  const totalAmount = currentSubtotal + deliveryFee;


  const placeOrder = async (event) => {
    event.preventDefault();

       if (userData && userData.isBlocked) {
      toast.error("Account Restricted! You cannot proccess items.");
      return;
    }


    let orderItems = [];

    // console.log se check karein ki data sahi format mein hai ya nahi
    console.log("Current Cart:", cartItems);
    console.log("Selected Seller ID:", sellerId);

    food_list.map((item) => {
      // 1. Seller ID nikalne ka sabse safe tarika (Object ho ya String, dono handle honge)
      const itemSellerId = item.sellerId?._id ? item.sellerId._id.toString() : item.sellerId?.toString();
      const targetSellerId = sellerId?.toString();

      // 2. Logic: Item cart mein ho AUR sellerId match kare
      if (cartItems[item._id] > 0 && itemSellerId === targetSellerId) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];

        // Backend ke liye sellerId ko string format mein fix kar dete hain
        itemInfo["sellerId"] = itemSellerId;

        orderItems.push(itemInfo);
      }
    });

    // 3. Safety Check: Agar items empty hain toh request mat bhejo
    if (orderItems.length === 0) {
      toast.error("No items found for this seller in your cart!");
      console.log("Error: orderItems array is empty. Check if sellerId matches.");
      return;
    }

    let orderData = {
      address: data,
      items: orderItems,
      amount: totalAmount, // Filtered amount (currentSubtotal + delivery)
    };

    console.log("Final Order Data being sent:", orderData);

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

      if (response.data.success) {
        toast.success("Order placed for this seller!");
        // Order ID ko scanner page ke liye save kar rahe hain
        localStorage.setItem("lastOrderId", response.data.orderId);
        localStorage.setItem("tempPayAmount", totalAmount);
        navigate('/payment');
      } else {
        toast.error(response.data.message || "Error placing order");
      }
    } catch (error) {
      console.error("Order API Error:", error);
      toast.error("Server error. Please try again.");
    }
  };



  return (
    <form className='place-order' onSubmit={placeOrder} >
      <div className="place-order-left">
        <p className='tittle'>Delivery Information</p>
        <div className="multi-fields">
          <input type="text" name='firstName' placeholder='First Name' onChange={onChangeHandler} value={data.firstName} required />
          <input type="text" name='lastName' placeholder='Last Name' onChange={onChangeHandler} value={data.lastName} required />
        </div>
        <input type="email" name='email' placeholder='Email address' onChange={onChangeHandler} value={data.email} required />
        <input type="text" name='street' placeholder='Street' onChange={onChangeHandler} value={data.street} required />
        <div className="multi-fields">
          <input type="text" name='city' placeholder='City' onChange={onChangeHandler} value={data.city} required />
          <input type="text" name='state' placeholder='State' onChange={onChangeHandler} value={data.state} />
        </div>
        <div className="multi-fields">
          <input type="text" name='zipcode' placeholder='Zip code' onChange={onChangeHandler} value={data.zipcode} />
          <input type="text" name='country' placeholder='Country' onChange={onChangeHandler} value={data.country} />
        </div>
        <input type="text" name='phone' placeholder='Phone' onChange={onChangeHandler} value={data.phone} required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <p style={{ fontSize: '12px', color: 'tomato' }}>Ordering from Seller ID: {sellerId}</p>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{currentSubtotal}</p> {/* Filtered Subtotal */}
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{totalAmount}</b> {/* Filtered Total */}
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}
