import React from 'react'
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
    let role = localStorage.getItem('role'); 
    console.log(role);

    return role === 'admin' ? children : <Navigate to="/" />;
}

export default AdminRoute;
