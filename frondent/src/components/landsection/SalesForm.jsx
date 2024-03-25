import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';

const SalesForm = ({ landId, onCloseModal }) => {
  const [salesData, setSalesData] = useState({
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
    phoneNumber: false,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_SERVER}/api/lands/${landId}/sales`, salesData);
      toast.success('Sales form submitted successfully!');
      setTimeout(() => {
        onCloseModal();
      }, 1000);
    } catch (error) {
      toast.error(`Error submitting sales form: ${error.message}`);
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

    // Clear validation error for the input being changed
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const validateInputs = () => {
    const nameRegex = /^[a-zA-Z\s]{1,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{9,10}$/;

    let isValid = true;

    if (!nameRegex.test(salesData.name)) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        name: true,
      }));
      isValid = false;
    }

    if (!emailRegex.test(salesData.email)) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        email: true,
      }));
      isValid = false;
    }

    if (!phoneRegex.test(salesData.phoneNumber)) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: true,
      }));
      isValid = false;
    }

    return isValid;
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
           Full Name:
          <input
            type="text"
            name="name"
            value={salesData.name}
            onChange={handleInputChange}
            style={{ borderColor: validationErrors.name ? 'red' : 'initial' }}
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
            style={{ borderColor: validationErrors.email ? 'red' : 'initial' }}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={salesData.phoneNumber}
            onChange={handleInputChange}
            style={{ borderColor: validationErrors.phoneNumber ? 'red' : 'initial' }}
          />
        </label>
        <button 
          type="submit" 
          className="btn" 
          disabled={isLoading} 
        >
          {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Submit'}
        </button>

      </form>
      <ToastContainer />
    </>
  );
};

export default SalesForm;
