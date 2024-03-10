import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setIsLoading(true);

    try {
      await axios.post(`http://localhost:7001/api/lands/${landId}/rental`, rentalData);
      toast.success('Rental form submitted successfully!');
      setIsSuccess(true);
      setTimeout(() => {
        onCloseModal(); 
      }, 2000); 
      
    } catch (error) {
      console.error('Error submitting rental form:', error);
      setIsSuccess(false);
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
          />
        </label>
        <label>
          Rental End Date:
          <input
            type="date"
            name="endDate"
            value={rentalData.endDate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={rentalData.name}
            onChange={handleInputChange}
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
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={rentalData.phoneNumber}
            onChange={handleInputChange}
          />
        </label>
        {!isSubmitted && (
          <button type="submit" className="btn" style={{ background:'#0A3C50'}}>
            Submit 
          </button>
        )}
        {isSubmitted && (
          <>
          <button type="submit" className="btn" style={{ background:'#0A3C50'}}>
            {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
            {!isLoading && isSuccess && <FontAwesomeIcon icon={faCheck} style={{ color:'green'}}/>}
            {!isLoading && !isSuccess && <FontAwesomeIcon icon={faTimesCircle} style={{color:'red'}}/>}
            
            Submit 
          </button>
          </>
        )}
      </form>
      <ToastContainer />
    </>
  );
};

export default RentalForm;
