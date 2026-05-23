import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import Navbar from './componants/Navbar/Navbar'
import { useLocation } from 'react-router-dom'; // Upar import karlo
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/cart/Cart'
import PlaceOrder from './pages/placeOrder/PlaceOrder'
import Footer from './componants/Footer/Footer'
import LoginPopup from './componants/LoginPopop/LoginPopup'
import Payment from './pages/Payment/Payment'
import AdminDashboard from "./componants/AdminDashboard/AdminDashboard"
import SellerDashboard from "./componants/SellerDashboard/SellerDashboard"
import ProtectedRoute from '../ProtectedRoute'
import Add from "./componants/SellerDashboard/Add/Add"
import List from "./componants/SellerDashboard/List/List"
import Orders from "./componants/SellerDashboard/Orders/Orders"
import MyOrder from './componants/UserDashboard/UserOrder/MyOrder'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './componants/AdminDashboard/Dashboard/Dashboard'
import AllOrders from './componants/AdminDashboard/All Orders/AllOrders'
import ManageUsers from './componants/AdminDashboard/Manage Users/ManageUsers'
import ManageSeller from './componants/AdminDashboard/Manage Sellers/ManageSellers'
import UserDashboard from './componants/UserDashboard/UserDashboard'
import SellerDash from "./componants/SellerDashboard/Dashboard/Dashboard"
import Messages from './componants/AdminDashboard/Messages/Messages'
import ContactSeller from './componants/SellerDashboard/Contact-us/ContactSeller'
import ContactUser from './componants/UserDashboard/Contact-us/ContactUser'
import AddCategory from './componants/AdminDashboard/Add Category/AddCategory'


function App() {

  const { pathname } = useLocation();
  const location = useLocation();
  // Shortcut: Har baar path badalne par scroll reset
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const isAdminOrSeller = location.pathname.startsWith('/admin-dashboard') || location.pathname.startsWith('/seller-dashboard');


  const [showLogin, setShowLogin] = useState(false);

  // const url = "http://localhost:3000";
  const url = import.meta.env.VITE_BACKEND_URL;

  return (
    <>

      {!isAdminOrSeller && <Navbar setShowLogin={setShowLogin} />}

      {showLogin ? <LoginPopup setShowLogin={setShowLogin} url={url} /> : <></>}

      <div className="app">
        <ToastContainer style={{ zIndex: 99999 }} />
        {/* <Navbar setShowLogin={setShowLogin} /> */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/payment' element={<Payment/>} />


          <Route path='/admin-dashboard' element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>

          } >
            <Route index element={<Dashboard url={url} />} />
            <Route path="dash" element={<Dashboard url={url} />} />
            <Route path="allorders" element={<AllOrders url={url} />} />
            <Route path="managesellers" element={<ManageSeller url={url} />} />
            <Route path="manageusers" element={<ManageUsers url={url} />} />
            <Route path="messages" element={<Messages url={url} />} />
            <Route path="addcategory" element={<AddCategory url={url} />} />
          </Route>

          <Route path='/seller-dashboard' element={
            <ProtectedRoute allowedRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          } >
            {/* Ye components Dashboard ke Outlet mein dikhenge */}
            <Route index element={<SellerDash url={url} />} />
            <Route path="dash" element={<SellerDash url={url} />} />
            <Route path="add" element={<Add url={url} />} />
            <Route path="list" element={<List url={url} />} />
            <Route path="orders" element={<Orders url={url} />} />
            <Route path="contactseller" element={<ContactSeller url={url} />} />
          </Route>

          <Route path='/user-dashboard' element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } >
            <Route index element={<MyOrder />} />
            <Route path='myorders' element={<MyOrder />} />
            <Route path='contactuser' element={<ContactUser />} />

          </Route>

        </Routes >
      </div >
      {!isAdminOrSeller && <Footer />}

    </>
  )
}


export default App
