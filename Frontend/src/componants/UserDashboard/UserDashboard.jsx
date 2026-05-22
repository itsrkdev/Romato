import React from 'react'
import "./UserDashboard.css"
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'; // Ye zaroori hai

export default function UserDashboard() {
    return (
        <div className='dashboard-wrapper'>
            <Sidebar />
            <div className="dashboard-content">
                {/* Jab aap Add Items par click karenge, toh Add.jsx yahan dikhega */}
                <Outlet />
            </div>
        </div>
    )
}
