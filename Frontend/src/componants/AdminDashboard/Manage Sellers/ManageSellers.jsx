import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBan, FaCheckCircle, FaTrashAlt, FaSearch } from 'react-icons/fa';
import "./ManageSellers.css";

const ManageSellers = ({ url }) => {
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSellers = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/api/admin/allsellers`, { headers: { token } });
    if (response.data.success) {
      setSellers(response.data.data);
    } else {
      toast.error("Error fetching sellers");
    }
  }

  const filteredSellers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const removeSeller = async (sellerId) => {
    if (window.confirm("Are you sure you want to remove this seller?")) {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${url}/api/admin/remove-seller`, { id: sellerId }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSellers();
      }
    }
  }

  const blockHandler = async (id) => {
    const days = prompt("Kitne dino ke liye block karna hai?", "7");
    if (days) {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${url}/api/admin/block-seller`, { id, days }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSellers();
      }
    }
  }

  const unblockHandler = async (id) => {
    if (window.confirm("Do you want to unblock this seller?")) {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${url}/api/admin/unblock-seller`, { id }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSellers();
      }
    }
  }
  // ... (removeSeller, blockHandler, unblockHandler functions same rahenge) ...

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <div className="manage-container">
      <div className="list-add flex-col">
        <div className="header-section">
          <h2 className="title">All Registered Sellers</h2>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search sellers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="list-table">
          {/* Updated Header - Added 2 new b tags */}
          <div className="list-table-format-admin title-row">
            <b className="text-left">Name</b>
            <b className="text-left">Email</b>
            <b className="text-center">Orders</b> 
            <b className="text-center">Revenue</b> 
            <b className="text-center">Status</b>
            <b className="text-center">Block</b>
            <b className="text-center">Remove</b>
          </div>

          {/* Data Mapping */}
          {filteredSellers.length > 0 ? (
            filteredSellers.map((item, index) => (
              
              <div key={index} className="list-table-format-admin">
                <p className="text-left">{item.name}</p>
                <p className="text-left">{item.email}</p>
                
                {/* Stats Cells */}
                <p className="text-center bold-orange">{item.orderCount || 0}</p>
                <p className="text-center bold-black">₹{item.totalEarnings || 0}</p>
                
                <div className="align-center">
                  <span className={item.isBlocked ? "blocked-text" : "active-status"}>
                    {item.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>

                <div className="align-center cursor">
                  {item.isBlocked ? (
                    <FaCheckCircle className="unblock-btn icon-size" onClick={() => unblockHandler(item._id)} />
                  ) : (
                    <FaBan className="block-btn icon-size" onClick={() => blockHandler(item._id)} />
                  )}
                </div>

                <div className="align-center cursor">
                  <FaTrashAlt className="delete-icon icon-size" onClick={() => removeSeller(item._id)} />
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No sellers found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageSellers;
