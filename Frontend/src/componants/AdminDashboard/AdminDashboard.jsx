import React from 'react'
import "./AdminDashboard.css"
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import AdminNav from './AdminNav';
export default function AdminDashboard() {

    const navigate = useNavigate();



    return (
        <>
            <div className='admin-layout'>
                <AdminNav />
                <div className='dashboard-wrapper'>
                    <Sidebar />
                    <div className="dashboard-content">
                        <Outlet />
                    </div>
                </div>
            </div>

        </>
    )
}
