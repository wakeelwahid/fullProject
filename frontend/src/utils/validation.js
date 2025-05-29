
export const validateMobile = (mobile) => {
  if (!mobile) return "Mobile number is required";
  if (mobile.length !== 10) return "Mobile number must be exactly 10 digits";
  if (!/^[0-9]{10}$/.test(mobile)) return "Mobile number must contain only digits";
  if (mobile.startsWith('0')) return "Mobile number cannot start with 0";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (password.length > 50) return "Password must be less than 50 characters";
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    return "Password must contain at least one letter and one number";
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

export const validateAmount = (amount) => {
  if (!amount) return "Amount is required";
  if (isNaN(amount)) return "Amount must be a valid number";
  if (parseFloat(amount) <= 0) return "Amount must be greater than 0";
  if (parseFloat(amount) > 100000) return "Amount cannot exceed ₹1,00,000";
  return null;
};

export const validateUTR = (utr) => {
  if (!utr) return "UTR number is required";
  if (utr.length < 12) return "UTR number must be at least 12 characters";
  if (!/^[A-Za-z0-9]+$/.test(utr)) return "UTR number must contain only letters and numbers";
  return null;
};
