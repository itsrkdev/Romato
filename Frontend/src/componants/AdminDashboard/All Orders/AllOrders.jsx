import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from "../../../assets/assets"; // Apne assets folder se parcel icon lein
import "./AllOrders.css";

const AllOrders = ({ url }) => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${url}/api/admin/all-orders`, { headers: { token } });
        if (response.data.success) {
            setOrders(response.data.data);
        } else {
            toast.error("Error fetching orders");
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className='order add'>
            <h3 className='title'>Master Order List</h3>
            <div className="order-list">
                {orders.reverse().map((order, index) => (
                    <div key={index} className='order-item'>
                        <img src={assets.parcel_icon} alt="Parcel Icon" />
                        <div>
                            <p className='order-item-food'>
                                {order.items.map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return item.name + " x " + item.quantity;
                                    } else {
                                        return item.name + " x " + item.quantity + ", ";
                                    }
                                })}
                            </p>
                            <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
                            <div className='order-item-address'>
                                <p>{order.address.street + ","}</p>
                                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                            </div>
                            <p className='order-item-phone'>{order.address.phone}</p>
                        </div>
                        <p>Items: {order.items.length}</p>
                        <p>₹{order.amount}</p>
                        <p className={`status-text ${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                            {order.status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllOrders;
