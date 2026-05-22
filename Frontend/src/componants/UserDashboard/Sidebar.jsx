import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/user-dashboard/myorders' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>My Order</p>
        </NavLink>
        <NavLink to='/user-dashboard/contactuser' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Contact-us</p>
        </NavLink>

      </div>
    </div>
  )
}
export default Sidebar
