import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css'; // CSS file for styling
import { toast } from 'react-toastify';
import { assets } from '../../../assets/assets'; // Parcel icon ke liye

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  // Seller ke orders fetch karne ka function
  const fetchSellerOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/sellerorders", { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong!");
    }
  };

  // Order status update karne ke liye (dropdown handler)
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      }, { headers: { token } });

      if (response.data.success) {
        toast.success("Status Updated Successfully");
        await fetchSellerOrders(); // List refresh karo
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    if (token) {
      fetchSellerOrders();
    }
  }, [token]);

  return (
    <div className='order-page'>
      <h3>Seller Orders</h3>
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className='order-items'>
              <img src={assets.parcel_icon} alt="parcel-icon" />

              <div className='order-details'>
                <p className='order-item-food'>
                  {/* Sirf is seller ke items ka naam aur quantity dikhana */}
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} x {item.quantity}{idx === order.items.length - 1 ? "" : ", "}
                    </span>
                  ))}
                </p>

                <p className='order-item-name'>
                  {order.address.firstName + " " + order.address.lastName}
                </p>

                <div className='order-item-address'>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.zipcode}</p>
                </div>

                <p className='order-item-phone'>{order.address.phone}</p>
              </div>

              <div className='order-stats'>
                <p>Items: {order.items.length}</p>
                <p className='order-amount'>₹{order.amount}</p>
              </div>

              <select
                className='status-select'
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
              >
                <option value="Placed">Placed</option>
                <option value="Food Processing">Processing</option>
                <option value="Out for delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                {/* <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option> */}
              </select>
            </div>
          ))
        ) : (
          <p className="no-orders">Abhi tak koi order nahi aaya hai.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;