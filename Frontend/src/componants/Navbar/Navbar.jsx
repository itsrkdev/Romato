import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { storeContext } from '../../context/StoreContext'

export default function Navbar({ setShowLogin }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount, setToken, setCartItems } = useContext(storeContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    const dashboardRoutes = {
        admin: '/admin-dashboard',
        seller: '/seller-dashboard',
        user: '/user-dashboard'
    };

    // Jab bhi page change ho, scroll top par jaye aur mobile menu band ho jaye
    useEffect(() => {
        window.scrollTo(0, 0);
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        setToken("");
        setCartItems({});
        navigate("/");
    }

    return (
        <div className='navbar'>
            <Link to="/"> <img src={assets.rlogo} alt="logo" className='logo' /></Link>
            
            {/* Desktop and Mobile Menu */}
            <ul className={`navbar-menu ${isMobileMenuOpen ? "active-mobile" : ""}`}>
                 <Link to="/" onClick={() => { setMenu("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={menu === "home" ? 'active' : ""}>Home </Link>
                {/* <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? 'active' : ""}>Home</Link> */}
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? 'active' : ""}>Menu</a>
                <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? 'active' : ""}>Mobile-app</a>
                <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? 'active' : ""}>Contact-us</a>
                
                {/* Mobile Only Dashboard Link */}
                {token && (
                    <li className="mobile-only-link" onClick={() => navigate(dashboardRoutes[role])}>
                        Dashboard ({role})
                    </li>
                )}
            </ul>

            <div className="navbar-right">
                <img src={assets.search_icon} alt="search" className="nav-search-icon" />
                <div className="navbar-basket-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="cart" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>

                {!token ? (
                    <button className="nav-signin-btn" onClick={() => setShowLogin(true)}>Sign In</button>
                ) : (
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
                )}

                {/* Hamburger Toggle */}
                <p className="mobile-toggle-icon" 
                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                  alt="toggle" 
                >
                 &#9776;
                </p>
        
            </div>
        </div>
    )
}


