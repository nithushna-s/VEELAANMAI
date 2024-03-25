import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';

const RentalForm = ({ landId, onCloseModal }) => {
  const [rentalData, setRentalData] = useState({
    startDate: '',
    endDate: '',
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const isFormValid = Object.keys(rentalData).every(inputName => isInputValid(inputName, rentalData[inputName]));

    if (!isFormValid) {
      toast.error('Please fill in all fields correctly.');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_SERVER}/api/lands/${landId}/rental`, rentalData);
      toast.success('Rental form submitted successfully!');
      setTimeout(() => {
        onCloseModal(); 
      }, 2000); 
      
    } catch (error) {
      console.error('Error submitting rental form:', error);
      toast.error('An error occurred while submitting the rental form.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRentalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const nameRegex = /^[a-zA-Z\s]{1,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const phoneRegex = /^\d{9,10}$/;

  const isInputValid = (inputName, inputValue) => {
    switch (inputName) {
      case 'startDate':
      case 'endDate':
        return dateRegex.test(inputValue);
      case 'name':
        return nameRegex.test(inputValue);
      case 'email':
        return emailRegex.test(inputValue);
      case 'phoneNumber':
        return phoneRegex.test(inputValue);
      default:
        return true;
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
        <button onClick={onCloseModal} style={{ border: 'none', cursor: 'pointer',color: '#0A3C50',background:'none', fontSize:'2em' }} >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <form onSubmit={handleFormSubmit} style={{background:'white',padding:'10px', fontFamily: 'Raleway,fantasy'}}>
        <h4>Land Rental Request</h4>
        <label>
          Rental Start Date:
          <input
            type="date"
            name="startDate"
            value={rentalData.startDate}
            onChange={handleInputChange}
            style={{ borderColor: isSubmitted && !isInputValid('startDate', rentalData.startDate) ? 'red' : 'black' }}
          />
        </label>
        <label>
          Rental End Date:
          <input
            type="date"
            name="endDate"
            value={rentalData.endDate}
            onChange={handleInputChange}
            style={{ borderColor: isSubmitted && !isInputValid('endDate', rentalData.endDate) ? 'red' : 'black' }}
          />
        </label>
        <label>
        Full Name:
          <input
            type="text"
            name="name"
            value={rentalData.name}
            onChange={handleInputChange}
            style={{ borderColor: isSubmitted && !isInputValid('name', rentalData.name) ? 'red' : 'black' }}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={rentalData.address}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={rentalData.email}
            onChange={handleInputChange}
            style={{ borderColor: isSubmitted && !isInputValid('email', rentalData.email) ? 'red' : 'black' }}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={rentalData.phoneNumber}
            onChange={handleInputChange}
            style={{ borderColor: isSubmitted && !isInputValid('phoneNumber', rentalData.phoneNumber) ? 'red' : 'black' }}
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

export default RentalForm;
