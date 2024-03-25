import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSalesList = () => {
  const [salesDetails, setSalesDetails] = useState([]);

  useEffect(() => {
    const fetchSalesDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/admin/sales-details`,{withCredentials:true});
        const reversedSalesDetails = response.data.reverse();
        setSalesDetails(reversedSalesDetails);
      } catch (error) {
        console.error('Error fetching sales details:', error);
      }
    };

    fetchSalesDetails();
  }, []);

  return (
    <div class="table-responsive ">
      <h2 style={{textAlign:'center',color:'#137077',marginTop:'8%'}}>All Sales Details</h2>
      <table class="table table-bordered table-hover " style={{width:'70%',marginLeft:'15%'}}>
        <thead className='table-light'>
          <tr>
            <th>Number</th>
            <th>Sales-ID</th>
            <th>Land-ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(salesDetails) &&
            salesDetails.map((sale, index) => (
              <tr key={sale._id}>
                   <td>{salesDetails.length - index}</td>
                <td>{sale._id}</td>
                <td>{sale.land}</td>
                <td>{sale.name}</td>
                <td>{sale.address}</td>
                <td>{sale.email}</td>
                <td>{sale.phoneNumber}</td>
                <td>{sale.timestamp}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSalesList;
