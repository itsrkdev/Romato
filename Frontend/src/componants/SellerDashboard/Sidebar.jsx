import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import "../SellerDashboard/SellerDashboard.css"

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
         <NavLink to='/seller-dashboard/dash' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Dashboard</p>
        </NavLink>
        <NavLink to='/seller-dashboard/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/seller-dashboard/list' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
        </NavLink>
        <NavLink to='/seller-dashboard/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>All Orders</p>
        </NavLink>
        <NavLink to='/seller-dashboard/contactseller' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Contact-us</p>
        </NavLink>
      </div>
    </div>
  )
}
export default Sidebar