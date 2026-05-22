import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from "react-router-dom"
import "./SellerDashboard.css"
import { storeContext } from '../../context/StoreContext'

function SellerNav() {

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    const { setToken } = useContext(storeContext);

    const dashboardRoutes = {
        admin: '/admin-dashboard',
        seller: '/seller-dashboard',
        user: '/user-dashboard'
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        setToken("");
        navigate("/");
    }
    const navigate = useNavigate();




    return (


        <div className="admin-navbar">
            <div className="nav-left">
                <img className="logo" src={assets.rlogo} alt="logo" />
                {/* <img  src={assets.logo} alt="Logo" /> */}
                <span className="admin-badge">Seller Panel</span>
            </div>
            {/* <img className="profile" src={assets.profile_image} alt="Profile" /> */}
            <div className='navbar-profile'>
                <div className="user-info">
                    <img src={assets.profile_icon} alt="profile" />
                    <div className="user-text">
                        <span>{name || "User"}</span>
                        <small>{role}</small>
                    </div>
                </div>
                <ul className='nav-profile-dropdown'>
                    <li onClick={() => navigate(dashboardRoutes[role] || '/user-dashboard')}>
                        <img src={assets.bag_icon} alt="" /><p>Dashboard</p>
                    </li>
                    <hr />
                    <li onClick={logout}>
                        <img src={assets.logout_icon} alt="" /><p>Logout</p>
                    </li>
                </ul>
            </div>
        </div>
    )

}

export default SellerNav