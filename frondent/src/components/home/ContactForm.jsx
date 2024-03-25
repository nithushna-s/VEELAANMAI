import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone, faEnvelope, faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Assets/CSS/ContactForm.css";
import im from "../Assets/image/5.jpg";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitIcon, setSubmitIcon] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!validateEmail(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      errors.message = "Please enter your message.";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitIcon(faSpinner); 

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResponse(data.message);

      if (response.status === 200) {
        toast.success("Email sent successfully!");
        setSubmitIcon(faCheck); 
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else {
        setSubmitIcon(faTimes); 
        setTimeout(() => {
          setSubmitIcon(null);
        }, 4000);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setResponse("Error sending the email. Please try again.");
      setSubmitIcon(faTimes); 
      setTimeout(() => {
        toast.error("Error sending the email. Please try again.");
      }, 1000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="contact">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "5%",
          height: "65vh",
          marginBottom: "10%",
          fontFamily: "Raleway,fantasy",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "64%",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            className="Contact-Information"
            style={{
              flex: 1,
              padding: "40px",
              width: "100%",
              textAlign: "justify",
              fontFamily: "Raleway, fantasy",
              borderRight: "1px solid #ccc",
              background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${im})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
            }}
          >
            <h2 style={{ marginLeft: "12%" }}>Contact Information</h2>
            <br />
            <br />
            <p style={{ paddingLeft: "13%", fontSize: "17px" }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Address:
              Rameshpuram,chenkalady,batticaloa.
            </p>
            <br />
            <br />
            <p style={{ paddingLeft: "13%", fontSize: "17px" }}>
              <FontAwesomeIcon icon={faPhone} /> Phone: (123) 456-7890
            </p>
            <br />
            <br />
            <p style={{ paddingLeft: "13%", fontSize: "17px" }}>
              <FontAwesomeIcon icon={faEnvelope} /> Email: velanmai@gmail.com
            </p>
          </div>

          <div
            className="contact-form-container"
            style={{
              flex: 1,
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#137077" }}>Contact Form</h2>
            <br />
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <label style={{ marginBottom: "8px", fontSize: "17px" }}>
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: "75%",
                  padding: "8px",
                  marginBottom: "16px",
                  border: `1px solid ${validationErrors.name ? "red" : "#ccc"}`,
                  borderRadius: "4px",
                }}
              />
              {validationErrors.name && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {validationErrors.name}
                </p>
              )}

              <label style={{ marginBottom: "8px", fontSize: "17px" }}>
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "75%",
                  padding: "8px",
                  marginBottom: "16px",
                  border: `1px solid ${
                    validationErrors.email ? "red" : "#ccc"
                  }`,
                  borderRadius: "4px",
                }}
              />
              {validationErrors.email && (
                <p style={{ color: "red", marginTop: "0px" }}>
                  {validationErrors.email}
                </p>
              )}

              <label style={{ marginBottom: "8px", fontSize: "17px" }}>
                Message:
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                style={{
                  width: "75%",
                  padding: "8px",
                  marginBottom: "16px",
                  border: `1px solid ${
                    validationErrors.message ? "red" : "#ccc"
                  }`,
                  borderRadius: "4px",
                }}
              />
              {validationErrors.message && (
                <p style={{ color: "red", marginTop: "0px" }}>
                  {validationErrors.message}
                </p>
              )}

<button
  className="button-82-pushable"
  role="button"
  style={{ textAlign: "center", cursor: "pointer", width: "78%" }}
>
  <span className="button-82-shadow"></span>
  <span className="button-82-edge"></span>
  <span className="button-82-front">
    {submitting ? (
      <FontAwesomeIcon icon={faSpinner} spin />
    ) : response && response.includes("success") ? (
      <FontAwesomeIcon icon={faCheck} />
    ) : response ? (
      <FontAwesomeIcon icon={faTimes} />
    ) : (
      "Submit"
    )}
  </span>
</button>

            </form>

            {response && (
              <p
                style={{
                  color: response.includes("success") ? "green" : "red",
                  marginTop: "0px",
                }}
              >
                {response}
              </p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactForm;
