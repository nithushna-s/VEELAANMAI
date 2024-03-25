import React, { useState } from "react";
import Navbar from "../home/nav";
import Footernext from "../home/abouthefooter";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import im from "../Assets/image/photo2.jpg";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isPasswordVisible: false,
    isFormValid: true,
    validationErrors: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      isFormValid: true,
      validationErrors: {
        ...formData.validationErrors,
        [name]: "",
      },
    });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
  };

  const validateForm = () => {
    const { firstName, lastName, email, password } = formData;
    const validationErrors = {};

    if (!validateName(firstName)) {
      validationErrors.firstName = "Please enter a valid first name";
    }

    if (!validateName(lastName)) {
      validationErrors.lastName = "Please enter a valid last name";
    }

    if (!validateEmail(email)) {
      validationErrors.email = "Please enter a valid email address";
    }

    if (!validatePassword(password)) {
      validationErrors.password = "Password must be at least 8 characters long";
    }

    setFormData({
      ...formData,
      validationErrors,
    });

    return Object.keys(validationErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      isPasswordVisible: !prevFormData.isPasswordVisible,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/api/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          toast.success("Sign Up successful!");

          Cookies.set("user", JSON.stringify(userData.user), { expires: 1 });
          Cookies.set("token", userData.token, { expires: 1 });

          setIsSuccess(true);
          setTimeout(() => {
            navigate("/SignIn");
          }, 2000);
          console.log("Sign Up submitted:", formData);
        } else {
          const errorData = await response.json();
          console.error("Error during signup:", errorData);
          toast.error("User already registered");
        }
      } catch (error) {
        console.error("Error during signup:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  const { validationErrors, isPasswordVisible } = formData;
  const authInnerStyle = {
    width: "450px",
    margin: "auto",
    marginTop: "6%",
    background: "#ffffff",
    boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
    padding: "40px 55px 45px 55px",
    borderRadius: "15px",
    marginBottom: "1%",
    transition: "all .3s",
    fontFamily: "Raleway,fantasy",
    fontFamily: "Raleway, fantasy",
    background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${im})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color:'white'
  };

  return (
    <>
      <Navbar />

      <form onSubmit={handleSubmit} style={authInnerStyle}>
        <h3 style={{  textAlign: "center" }}>Sign Up</h3>
        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            name="firstName"
            className={`form-control ${
              validationErrors.firstName ? "is-invalid" : ""
            }`}
            placeholder="First name"
            onChange={handleInputChange}
          />
          {validationErrors.firstName && (
            <div className="invalid-feedback">{validationErrors.firstName}</div>
          )}
        </div>
        <div className="mb-3">
          <label>Last name</label>
          <input
            type="text"
            name="lastName"
            className={`form-control ${
              validationErrors.lastName ? "is-invalid" : ""
            }`}
            placeholder="Last name"
            onChange={handleInputChange}
          />
          {validationErrors.lastName && (
            <div className="invalid-feedback">{validationErrors.lastName}</div>
          )}
        </div>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            className={`form-control ${
              validationErrors.email ? "is-invalid" : ""
            }`}
            placeholder="Enter email"
            onChange={handleInputChange}
          />
          {validationErrors.email && (
            <div className="invalid-feedback">{validationErrors.email}</div>
          )}
        </div>
        <div className="mb-3">
          <label>Password</label>
          <div className="input-group">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              className={`form-control ${
                validationErrors.password ? "is-invalid" : ""
              }`}
              placeholder="Enter password"
              onChange={handleInputChange}
            />
            <span
              className="input-group-text"
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              <i
                className={`fas ${
                  isPasswordVisible ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </span>
          </div>
          {validationErrors.password && (
            <div className="invalid-feedback">{validationErrors.password}</div>
          )}
        </div>
        <div className="d-grid">
          {!isLoading && !isSuccess && (
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "7px", background: "#0A3C50" }}
            >
              Submit
            </button>
          )}
          {(isLoading || isSuccess) && (
            <button
              className="btn btn-primary"
              style={{
                padding: "7px",
                background: "#0A3C50",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ marginLeft: "5px" }}>
                {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
                {isSuccess && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{
                      fontSize: "24px",
                      color: "green",
                      marginLeft: "25%",
                    }}
                  />
                )}
                {!isSuccess && (
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{
                      fontSize: "24px",
                      color: "red",
                      marginLeft: "25%",
                    }}
                  />
                )}
                Submit
              </span>
            </button>
          )}
        </div>

        <br />
        <p className="forgot-password text-right">
          Already registered{" "}
          <a href="/SignIn" style={{ display: "inline" }}>
            sign in?
          </a>
        </p>
        {!formData.isFormValid && (
          <p className="text-danger">
            Please enter valid information for all fields before submitting the
            form.
          </p>
        )}
      </form>
      <Footernext />
      <ToastContainer />
    </>
  );
};

export default SignUp;
