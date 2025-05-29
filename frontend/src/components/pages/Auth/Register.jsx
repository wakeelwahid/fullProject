import React, { useState } from "react";
import {
  FaUser,
  FaMobileAlt,
  FaEnvelope,
  FaLock,
  FaUserTag,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    referral_code: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (formData.username.length > 50) {
      setError("Username must be less than 50 characters");
      return;
    }

    if (!formData.mobile.trim()) {
      setError("Mobile number is required");
      return;
    }

    if (formData.mobile.length !== 10) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      setError("Mobile number must contain only digits");
      return;
    }

    if (formData.mobile.startsWith('0')) {
      setError("Mobile number cannot start with 0");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password.length > 50) {
      setError("Password must be less than 50 characters");
      return;
    }

    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      setError("Password must contain at least one letter and one number");
      return;
    }

    if (!formData.confirmPassword.trim()) {
      setError("Please confirm your password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.referral_code && formData.referral_code.length < 6) {
      setError("Referral code must be at least 6 characters if provided");
      return;
    }

    try {
      setError(""); // clear previous errors
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username: formData.username.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email?.trim() || "",
        password: formData.password,
        confirm_password: formData.confirmPassword,
        referral_code: formData.referral_code?.trim() || "",
      });

      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      const data = err.response?.data;

      if (err.response?.status === 400) {
        if (data?.mobile) {
          setError("Mobile number already exists. Please use a different number.");
        } else if (data?.referred_by) {
          setError("Invalid referral code. Please check and try again.");
        } else if (data?.username) {
          setError(data.username[0]);
        } else {
          setError("Registration failed. Please check your details.");
        }
      } else {
        setError("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Register</h2>
          <p>Fill in your details to create an account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaMobileAlt />
            </div>
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              maxLength="10"
              pattern="[0-9]{10}"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              minLength="6"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaUserTag />
            </div>
            <input
              type="text"
              name="referral_code"
              placeholder="Referral Code (optional)"
              value={formData.referral_code}
              onChange={handleChange}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-btn">
            Register
          </button>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;