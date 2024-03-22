import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../home/nav";
import Footernext from "../home/abouthefooter";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import im from "../Assets/image/photo.jpg";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); 
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    setIsEmailValid(isEmailValid);
    setIsPasswordValid(isPasswordValid);
    return isEmailValid && isPasswordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:7001/api/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
  
      const { token, role } = response.data; // Destructure role from response
  
      localStorage.setItem("token", token);
      localStorage.setItem("role", role); // Store role in localStorage
  
      document.cookie = `token=${token}; max-age=3600; path=/ ;sameSite=None`;
      document.cookie = `role=${role}`; // Set role in cookies
  
      if (role === "admin") {
        toast.success("Admin sign-in successful!");
        setTimeout(() => {
          navigate("/admin/Dashboard");
        }, 2000);
      } else {
        toast.success("Sign-in successful!");
        setTimeout(() => {
          navigate("/post-adform");
        }, 2000);
      }
      setLoginSuccess(true); 
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Invalid email or password. Please try again.");
      setLoginSuccess(false); 
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const authInnerStyle = {
    width: "450px",
    margin: "auto",
    boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
    padding: "40px 55px 45px 55px",
    borderRadius: "15px",
    marginTop: "8%",
    transition: "all .3s",
    marginBottom: "3%",
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
        <h3 style={{  textAlign: "center" }}>Sign In</h3>
        <div className={`mb-3 ${isEmailValid ? "has-success" : "has-error"}`}>
          <label>Email address</label> <br /> <br />
          <input
            type="email"
            name="email"
            className={`form-control ${isEmailValid ? "none" : "is-invalid"}`}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>  
        <div
          className={`mb-3 ${isPasswordValid ? "has-success" : "has-error"}`}
        >
          <label>Password</label><br /> <br />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`form-control ${
                isPasswordValid ? "none" : "is-invalid"
              }`}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="icon"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color:'black',
              }}
            >
              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                aria-hidden="true"
              ></i>
            </span>
          </div>
        </div>
        <div className="d-grid"> <br />
          {!isSubmitted ? (
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "7px", background: "#0A3C50" }}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <span>Submit</span>
              )}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{
                padding: "7px",
                background: "#0A3C50",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={loginSuccess ? faCheck : faTimes}
                style={{
                  fontSize: "24px",
                  color: loginSuccess ? "green" : "red",
                  marginLeft: "25%",
                }}
              />
              <span>Submit</span>
            </button>
          )}
        </div>
        <br />
        <p className="forgot-password text-right">
          Create a new account{" "}
          <a href="/signup" style={{ display: "inline" }}>
            SignUp
          </a>
        </p>
      </form>
      <Footernext />
      <ToastContainer />
    </>
  );
};

export default Login;
