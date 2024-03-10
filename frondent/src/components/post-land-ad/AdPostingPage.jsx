import React, { useState } from 'react';
import PostAdForm from './PostAdForm';
import PaymentForm from './PaymentHead';

const AdPostingPage = () => {
  const [showPostAdForm, setShowPostAdForm] = useState(true);
  const [adFormData, setAdFormData] = useState(null);
  const token = localStorage.getItem("token");

  const handleAdFormSubmit = (formData) => {
    setAdFormData(formData);
    setShowPostAdForm(false);
  };

  return (
    <div>
      {token ? (
           <>
           {showPostAdForm && <PostAdForm onFormSubmit={handleAdFormSubmit} />}
           {!showPostAdForm && <PaymentForm adFormData={adFormData} />}
         </>
      
       
      ) : (
        window.location.href='/signin'
         
      )}
    </div>
  );
};

export default AdPostingPage;