import React, { useContext, useEffect, useState } from 'react'
import './MyOrder.css'
import { storeContext } from '../../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../../assets/assets';

export default function MyOrder() {
    const { url, token } = useContext(storeContext);
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
    }

    const openTrackModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
        fetchOrders(); 
    }

    useEffect(() => {
        if (token) { fetchOrders(); }
    }, [token])

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="orders-container">
                {/* Fixed Header Row */}
                <div className="order-table-format order-table-header">
                    <b>Parcel</b>
                    <b>Items</b>
                    <b>Amount</b>
                    <b>Quantity</b>
                    <b>Status</b>
                    <b>Action</b>
                </div>

                {/* Data Rows */}
                {data.length > 0 ? data.map((order, index) => (
                    <div key={index} className='order-table-format order-row'>
                        <div className="img-col">
                            <img src={assets.parcel_icon} alt="parcel" className="parcel-img" />
                        </div>

                        <p className="items-text">
                            {order.items.map((item, idx) => (
                                idx === order.items.length - 1 ? `${item.name} x ${item.quantity}` : `${item.name} x ${item.quantity}, `
                            ))}
                        </p>
                        <p className="amount-col">₹{order.amount}.00</p>
                        <p className="qty-col">{order.items.length}</p>
                        <div className="order-status">
                            <span className={`status-dot ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>&#x25cf;</span> 
                            <b>{order.status}</b>
                        </div>
                        <div className="action-col">
                            <button className="track-btn" onClick={() => openTrackModal(order)}>Track Order</button>
                        </div>
                    </div>
                )) : <p className='no-data'>No orders found.</p>}
            </div>

            {/* --- TRACKING MODAL --- */}
            {showModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="status-modal">
                        <div className="modal-header">
                            <h3>Track Order #{selectedOrder._id.slice(-6)}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <div className="stepper-wrapper">
                            <div className={`step ${selectedOrder.status !== "" ? "completed" : ""}`}>
                                <div className="circle">1</div>
                                <p>Placed</p>
                            </div>
                            <div className={`step ${["Food Processing", "Out for Delivery", "Delivered"].includes(selectedOrder.status) ? "completed" : ""}`}>
                                <div className="circle">2</div>
                                <p>Processing</p>
                            </div>
                            <div className={`step ${["Out for Delivery", "Delivered"].includes(selectedOrder.status) ? "completed" : ""}`}>
                                <div className="circle">3</div>
                                <p>Out for Delivery</p>
                            </div>
                            <div className={`step ${selectedOrder.status === "Delivered" ? "completed" : ""}`}>
                                <div className="circle">4</div>
                                <p>Delivered</p>
                            </div>
                        </div>
                        <button className="done-btn" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}

