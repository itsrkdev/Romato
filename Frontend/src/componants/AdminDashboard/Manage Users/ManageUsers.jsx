import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUserSlash, FaBan, FaCheckCircle,FaTrashAlt, FaSearch } from 'react-icons/fa';
import "./ManageUsers.css";

const ManageUsers = ({ url }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false); // Loading state

    const fetchUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${url}/api/admin/all-users`, { headers: { token } });
            if (response.data.success) {
                setUsers(response.data.data);
            } else {
                toast.error("Error fetching users");
            }
        } catch (error) {
            toast.error("Server error while fetching users");
        } finally {
            setLoading(false);
        }
    }

    const deleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.post(`${url}/api/admin/remove-user`, { id: userId }, { headers: { token } });
                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchUsers();
                } else {
                    toast.error("Error deleting user");
                }
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    }

    const toggleBlockStatus = async (id, currentStatus) => {
        const endpoint = currentStatus ? "/api/admin/unblock-user" : "/api/admin/block-user";
        const confirmMsg = currentStatus ? "Unblock this user?" : "Block this user?";

        if (window.confirm(confirmMsg)) {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.post(url + endpoint, { id }, { headers: { token } });
                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchUsers();
                }
            } catch (error) {
                toast.error("Action failed");
            }
        }
    }

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="manage-container">
            <div className="header-section">
                <h2 className="title">Registered Customers</h2>
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="list-table">
                <div className="list-table-format title-row">
                    <b className="text-left">Name</b>
                    <b className="text-left">Email</b>
                    <b className="text-center">Status</b>
                    <b className="text-center">Block</b>
                    <b className="text-center">Remove</b>
                </div>

                {loading ? (
                    <p className="no-data">Loading users...</p>
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                        <div key={user._id || index} className="list-table-format">
                            <p className="text-left">{user.name}</p>
                            <p className="text-left">{user.email}</p>

                            <div className="align-center">
                                <span className={user.isBlocked ? "blocked-text" : "active-status"}>
                                    {user.isBlocked ? "Blocked" : "Active"}
                                </span>
                            </div>

                            <div className="align-center cursor">
                                {user.isBlocked ? (
                                    <FaCheckCircle className="unblock-btn icon-size" title="Unblock User" onClick={() => toggleBlockStatus(user._id, user.isBlocked)} />
                                ) : (
                                    <FaBan className="block-btn icon-size" title="Block User" onClick={() => toggleBlockStatus(user._id, user.isBlocked)} />
                                )}
                            </div>

                            <div className="align-center cursor">
                             
                                <FaTrashAlt className="delete-btn icon-size" onClick={() => deleteUser(user._id)} />
                                {/* <FaUserSlash className="delete-btn icon-size" title="Delete User" onClick={() => deleteUser(user._id)} /> */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='no-data'>No customers found matching "{searchTerm}"</p>
                )}
            </div>
        </div>
    );
}

export default ManageUsers;
