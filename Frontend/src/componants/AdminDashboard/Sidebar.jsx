import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import "./AdminDashboard.css"

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                <NavLink to='/admin-dashboard/dash' className="sidebar-option">
                    <img src={assets.add_icon} alt="" />
                    <p>Dashboard</p>
                </NavLink>
                <NavLink to='/admin-dashboard/allorders' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>All Orders</p>
                </NavLink>
                <NavLink to='/admin-dashboard/managesellers' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Manage Sellers</p>
                </NavLink>
                <NavLink to='/admin-dashboard/manageusers' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Manage Users</p>
                </NavLink>
                <NavLink to='/admin-dashboard/addcategory' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Add Category</p>
                </NavLink>
                <NavLink to='/admin-dashboard/messages' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Messages</p>
                </NavLink>
            </div>
        </div>
    )
}
export default Sidebar