import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 1. Agar token nahi hai, toh seedha Home page par bhej do
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // 2. Agar role match nahi karta (e.g. user admin dashboard kholne ki koshish kare), toh Home bhej do
    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    // 3. Agar sab sahi hai, toh dashboard dikhao
    return children;
};

export default ProtectedRoute;