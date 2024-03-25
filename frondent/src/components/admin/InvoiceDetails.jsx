import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentDetails = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/bill`, {
          withCredentials: true,
        });
        if (Array.isArray(response.data.invoices)) {
          setInvoices(response.data.invoices);
          setLoading(false);
        } else {
          console.error("Invoices data is not an array:", response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error.message);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div class="table-responsive ">
      <h1 style={{textAlign:'center',color:'#137077',marginTop:'8%'}}>All Payment Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table class="table table-bordered table-hover " style={{width:'75%',marginLeft:'13%'}}>
        <thead className='table-light'>
            <tr>
              <th style={tableHeaderStyle}>Invoice No</th>
              <th style={tableHeaderStyle}>Land-ID</th>
              <th style={tableHeaderStyle}>Payment ID</th>
              <th style={tableHeaderStyle}>Amount</th>
              <th style={tableHeaderStyle}>Cardholder Name</th>
              <th style={tableHeaderStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td style={tableCellStyle}>{invoice._id}</td>
                <td style={tableCellStyle}>{invoice.landId}</td>
                <td style={tableCellStyle}>{invoice.paymentIntentId}</td>
                <td style={tableCellStyle}>{invoice.amount}</td>
                <td style={tableCellStyle}>{invoice.cardholderName}</td>
                <td style={tableCellStyle}>{invoice.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const tableHeaderStyle = {
  backgroundColor: "#f2f2f2",
  textAlign: "left",
  border: "1px solid #ddd",
  padding: "8px",
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default PaymentDetails;
