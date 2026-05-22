import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaWallet, FaBoxOpen, FaUsers, FaStore } from 'react-icons/fa';
import "./Dashboard.css";

const Dashboard = ({ url }) => {
    const [data, setData] = useState({
        stats: {
            totalRevenue: 0,
            totalOrders: 0,
            totalUsers: 0,
            totalSellers: 0
        },
        recentOrders: []
    });

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${url}/api/admin/dash`, { headers: { token } });
            if (response.data.success) {
                setData({
                    stats: response.data.stats,
                    recentOrders: response.data.recentOrders
                });
            } else {
                toast.error("Error fetching dashboard data");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server Error");
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Admin Insights</h2>

            {/* 1. Stats Cards Grid */}
            <div className="stats-grid">
                <div className="stat-card revenue">
                    <div className="stat-info">
                        <p>Total Revenue</p>
                        <h3>₹{data.stats.totalRevenue || 0}</h3>
                    </div>
                    <FaWallet className="stat-icon" />
                </div>

                <div className="stat-card orders">
                    <div className="stat-info">
                        <p>Total Orders</p>
                        <h3>{data.stats.totalOrders || 0}</h3>
                    </div>
                    <FaBoxOpen className="stat-icon" />
                </div>

                <div className="stat-card users">
                    <div className="stat-info">
                        <p>Total Customers</p>
                        <h3>{data.stats.totalUsers || 0}</h3>
                    </div>
                    <FaUsers className="stat-icon" />
                </div>

                <div className="stat-card sellers">
                    <div className="stat-info">
                        <p>Active Sellers</p>
                        <h3>{data.stats.totalSellers || 0}</h3>
                    </div>
                    <FaStore className="stat-icon" />
                </div>
            </div>

            {/* 2. Recent Orders Table */}
            <div className="recent-orders-section">
                <h3 className="section-title">Recent Transactions</h3>
                <div className="table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentOrders.length > 0 ? (
                                data.recentOrders.map((order, index) => (
                                    <tr key={index}>
                                        <td>#{order._id.slice(-6).toUpperCase()}</td>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td>₹{order.amount}</td>
                                        <td>
                                            <span className={`status-badge ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No recent orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;