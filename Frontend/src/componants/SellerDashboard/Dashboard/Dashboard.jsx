import React, { useContext, useEffect, useState } from 'react';
import './Dashboard.css';
import { storeContext } from '../../../context/StoreContext';
import axios from 'axios';

const Dashboard = () => {
    const { url, token } = useContext(storeContext);
    
    // Initial state setup
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0
    });

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(url + "/api/food/dash", { headers: { token } });
            
            if (response.data.success) {
                // Backend se agar 'stats' key aa rahi hai toh use set karein
                // Agar aapne backend mein 'data' key rakhi hai toh response.data.data hi rehne dein
                const dashboardData = response.data.stats || response.data.data;
                
                if (dashboardData) {
                    setStats(dashboardData);
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    return (
        <div className='dashboard'>
            <h2>Seller Dashboard</h2>
            
            <div className="dashboard-stats">
                {/* stats?. lagane se agar data nahi bhi aaya toh undefined error nahi aayegi */}
                <div className="stat-card revenue">
                    <h3>Total Revenue</h3>
                    <p>₹{stats?.totalRevenue || 0}</p>
                </div>
                <div className="stat-card orders">
                    <h3>Total Orders</h3>
                    <p>{stats?.totalOrders || 0}</p>
                </div>
                <div className="stat-card products">
                    <h3>Active Products</h3>
                    <p>{stats?.totalProducts || 0}</p>
                </div>
            </div>

            <div className="dashboard-charts-placeholder">
                <h3>Sales Overview</h3>
                <p>Yahan aap future mein Graphs add kar sakte hain.</p>
            </div>
        </div>
    );
};

export default Dashboard;