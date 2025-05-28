// src/utils/api.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export const getWalletBalance = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/wallet/balance/`, authHeaders());
    return res.data.wallet_balance;
  } catch {
    return null;
  }
};

export const depositRequest = async (amount) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/wallet/deposit/`,
      { amount },
      authHeaders()
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Deposit failed." };
  }
};

export const withdrawRequest = async (amount) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/wallet/withdraw/`,
      { amount },
      authHeaders()
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Withdraw failed." };
  }
};

export const fetchTransactions = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/wallet/transactions/`, authHeaders());
    return res.data;
  } catch {
    return [];
  }
};


// utils/api.js

export const submitUTR = async (transaction_id, utr_number) => {
  const token = localStorage.getItem("access_token");
  return await axios.post(
    "http://127.0.0.1:8000/api/wallet/submit-utr/",
    { transaction_id, utr_number },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
