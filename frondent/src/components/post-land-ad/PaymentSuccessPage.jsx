import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../home/nav";
import Footernext from "../home/abouthefooter";

const PaymentSuccessPage = () => {
  const [storedLandImage, setStoredLandImage] = useState("");
  const { landId } = useParams(); 
  
  useEffect(() => {
    const storedImage = localStorage.getItem("imageUrl");
    if (storedImage) {
      setStoredLandImage(storedImage);
    }
  }, []);

  return (
    <>
    <Navbar />
    <div   className="card1"
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            padding: "39px",
            borderRadius: "8px",
            fontFamily: " fantasy",
            marginLeft: "25%",
            width: "50%",
            height: "fit-content",
            marginTop:'6%',
            marginBottom:'1%'
          }}>
      <h1 style={{textAlign:'center' }}>Payment Successful!</h1>
      {storedLandImage && (
        <img
          src={storedLandImage}
          alt="Land Image"
          style={{ maxWidth: "100%", height: "auto" ,paddingLeft:'13%'}}
        />
      )} <br />
      <p style={{ fontStyle: "italic", fontSize: "1.5em",textAlign:'center'}}>
        Your ad for land with ID: {landId}  <br /> has been  successfully submitted.
      </p>
    </div>
    <Footernext />

    </>
  );
};

export default PaymentSuccessPage;
