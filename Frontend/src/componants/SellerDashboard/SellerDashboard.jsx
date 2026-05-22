import React from 'react'
import "./SellerDashboard.css"
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'; // Ye zaroori hai
import SellerNav from './SellerNav';

export default function SellerDashboard() {
    return (

        <div className='admin-layout'>
           <SellerNav/>
            <div className='dashboard-wrapper'>
                <Sidebar />
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>

    )
}
