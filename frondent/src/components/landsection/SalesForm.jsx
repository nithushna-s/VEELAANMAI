import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

const SalesForm = ({ landId, onCloseModal }) => {
  const [salesData, setSalesData] = useState({
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`http://localhost:7001/api/lands/${landId}/sales`, salesData);
      toast.success('Sales form submitted successfully!');
      setIsSuccess(true);
      setTimeout(() => {
        onCloseModal();
      }, 1000);
    } catch (error) {
      toast.error(`Error submitting sales form: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSalesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onCloseModal} style={{ border: 'none', cursor: 'pointer', color: '#0A3C50', background: 'none', fontSize: '2em' }} >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <form onSubmit={handleFormSubmit} style={{ padding: '10px', fontFamily: 'Raleway' }}>
        <h4>Land Sale Request</h4>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={salesData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={salesData.address}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={salesData.email}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={salesData.phoneNumber}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit" className="btn" style={{ background:'#0A3C50'}}>
          Submit 
        </button>
        {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
        {!isLoading && isSuccess && <FontAwesomeIcon icon={faCheck} style={{ color:'green'}}/>}
        {!isLoading && !isSuccess && <FontAwesomeIcon icon={faTimesCircle} style={{color:'red'}}/>}
      </form>
      <ToastContainer />
    </>
  );
};

export default SalesForm;
