import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAdmin = localStorage.getItem("isAdmin") 
  const token = localStorage.getItem("token") 
  const shouldRender = isAdmin && token;
console.log('notview');
  return (
    <Routes>
      <Route
        {...rest}
        element={
          shouldRender ? (
            <Component />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
    </Routes>
  );
};

export default PrivateRoute;