import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentForm = () => {
  const [cardholderName, setCardholderName] = useState("");
  const [landId, setLandId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(3500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardholderNameValid, setIsCardholderNameValid] = useState(true);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchLandId = async () => {
      try {
        const storedLandId = localStorage.getItem("landId");
        if (storedLandId) {
          setLandId(storedLandId);
        }
      } catch (error) {
        console.error("Error fetching landId:", error);
      }
    };

    fetchLandId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardholderName.trim()) {
      toast.error("Please enter the cardholder name.");
      setIsCardholderNameValid(false);
      return;
    } else {
      setIsCardholderNameValid(true);
    }

    if (!landId.trim()) {
      toast.error("Please enter the land ID.");
      return;
    }

    setIsProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: cardholderName,
      },
    });

    if (error) {
      console.error("Error creating payment method:", error);
      toast.error(
        "Error creating payment method. Please check your card details."
      );
      setIsProcessing(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:7001/api/payment",  {
        paymentMethodId: paymentMethod.id,
        cardholderName: cardholderName,
        paymentAmount: paymentAmount,
        landId: landId,
      });

      console.log(response.data.message);
      toast.success("Payment successful and ad submitted!");
      setTimeout(() => {
        window.location.href = `/post-success/${landId}`;
      }, 4000);
    } catch (error) {
      console.error("Error processing payment:", error.message);
      toast.error("Error processing payment. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "15%",
          marginBottom: "10%",
        }}
      >
        <div
          className="card1"
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            padding: "39px",
            borderRadius: "8px",
            fontFamily: "fantasy",
            marginRight: "20px",
            width: "50%",
            height: "35vh",
          }}
        >
          <h4 style={{ paddingTop: "7%" }}>
            Land details submitted. Payment required for posting. Information
            will be verified before publishing.
          </h4>
          <h2>Listing Fee</h2>
          <br />
          <h6>
            <strong>Duration:</strong> 60 days
          </h6>
          <h6>
            <strong>Item Limit:</strong> 1 item per ad
          </h6>
          <h6>
            <strong>Cost:</strong> {paymentAmount} LKR
          </h6>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            padding: "20px",
            borderRadius: "8px",
            fontFamily: "fantasy",
            width: "50%",
            height: "35vh",
          }}
        >
          <h2 style={{ color: "#137077" }}>Payment Form</h2>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Cardholder Name:
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => {
                  setCardholderName(e.target.value);
                  setIsCardholderNameValid(e.target.value.trim() && /^[a-zA-Z. ]{1,15}$/.test(e.target.value));
                }}
                
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "10px",
                  border: `1px solid ${isCardholderNameValid ? '#ccc' : 'red'}`,
                  borderRadius: "5px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Land Id:
              </label>
              <input
                type="text"
                value={landId}
                onChange={(e) => setLandId(e.target.value)}
                
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: "20px", width: "60%" }}>
            <label>Card Details:</label>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#137077",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#10e2146",
                  },
                },
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <span>
              <label style={{ display: "inline" }}>Total Amount : </label>
              <p style={{ display: "inline" }}>{paymentAmount} LKR</p>
            </span>
          </div>

          <button
            type="submit"
            className="btn"
            style={{
              padding: "1% 7%",
              borderRadius: "10px",
              cursor: "pointer",
              marginLeft: "80%",
            }}
            disabled={isProcessing} 
          >
            {isProcessing ? (
               <i className="fa fa-spinner fa-spin"  ></i>
            ) : (
              "Pay"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default PaymentForm;
