import React, { useState, useRef, useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import styles from "./KYCVerification.module.css";
import { Link } from "react-router-dom";

const KYCVerification = () => {
  const [aadhaar, setAadhaar] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    isError: true,
  });

  const otpInputsRef = useRef([]);

  // Auto-focus first OTP input when OTP section is shown
  useEffect(() => {
    if (showOtpSection && otpInputsRef.current[0]) {
      otpInputsRef.current[0].focus();
    }
  }, [showOtpSection]);

  // Handle OTP input changes
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 5 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      otpInputsRef.current[index - 1]
    ) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  // Show popup function
  const showPopup = (title, message, isError = true) => {
    setPopup({
      show: true,
      title,
      message,
      isError,
    });
  };

  // Close popup function
  const closePopup = () => {
    setPopup({
      ...popup,
      show: false,
    });
  };

  // Send OTP button click
  const handleSendOtp = (e) => {
    e.preventDefault();

    if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
      showPopup(
        "Invalid Aadhaar",
        "Please enter a valid 12-digit Aadhaar number"
      );
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showPopup("Invalid Email", "Please enter a valid email address");
      return;
    }

    setShowOtpSection(true);
  };

  // Verify OTP button click
  const handleVerifyOtp = (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      showPopup("Incomplete OTP", "Please enter complete 6-digit OTP");
      return;
    }

    setShowOtpSection(false);
    setShowSuccess(true);
  };

  // Resend OTP link click
  const handleResendOtp = (e) => {
    e.preventDefault();
    showPopup("OTP Resent", "OTP has been resent to your email", false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          KYC <span>VERIFICATION</span>
        </div>
      </header>

      <div className={styles.mainContainer}>
        <div className={styles.kycForm}>
          {!showOtpSection && !showSuccess && (
            <form id="kycForm" onSubmit={handleSendOtp}>
              <div className={styles.formGroup}>
                <label htmlFor="aadhaar" className={styles.label}>
                  Aadhaar Card Number
                </label>
                <input
                  type="text"
                  id="aadhaar"
                  className={styles.input}
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength="12"
                  pattern="[0-9]{12}"
                  required
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email ID
                </label>
                <input
                  type="email"
                  id="email"
                  className={styles.input}
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.checkboxGroup}>
                <p className={styles.termsText}>
                  By proceeding, you agree to our{" "}
                  <Link to="/terms" className={styles.termsLink}>
                    Terms of Service
                  </Link>
                  , confirm you are 18+ years old, and verify you are not a
                  resident of restricted states including Nagaland, Sikkim, Meghalaya, Odisha, Assam, Tamil Nadu, Telangana, Andhra Pradesh
                  as per Indian gambling laws.
                </p>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Request for KYC
              </button>
            </form>
          )}

          {showOtpSection && !showSuccess && (
            <div className={styles.otpSection}>
              <h3 className={styles.otpTitle}>ENTER OTP</h3>
              <p className={styles.otpMessage}>
                We've sent a 6-digit OTP to your registered email
              </p>

              <div className={styles.otpInputs}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    className={styles.otpInput}
                    maxLength="1"
                    pattern="[0-9]"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    ref={(el) => (otpInputsRef.current[index] = el)}
                  />
                ))}
              </div>

              <button className={styles.verifyBtn} onClick={handleVerifyOtp}>
                VERIFY OTP
              </button>

              <div className={styles.resendOtp}>
                Didn't receive OTP?{" "}
                <a
                  href="#"
                  className={styles.resendLink}
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </a>
              </div>
            </div>
          )}

          {showSuccess && (
            <div className={styles.successMessage}>
              <FaCheckCircle className={styles.successIcon} />
              <h2 className={styles.successTitle}>
                KYC VERIFIED SUCCESSFULLY!
              </h2>
              <p>Your account has been successfully verified.</p>
              <Link to="/" className={styles.popupBtn}>
                OK
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Custom Popup for Errors/Messages */}
      {popup.show && (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.popupClose} onClick={closePopup}>
              <FaTimes />
            </span>
            <div className={styles.popupIcon}>
              {popup.isError ? (
                <FaExclamationCircle className={styles.errorIcon} />
              ) : (
                <FaInfoCircle className={styles.infoIcon} />
              )}
            </div>
            <h3 className={styles.popupTitle}>{popup.title}</h3>
            <p className={styles.popupMessage}>{popup.message}</p>
            <button className={styles.popupBtn} onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCVerification;
