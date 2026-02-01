// student-portal/src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Send OTP
export const sendOtp = async (phone) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, { phone });
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// Verify OTP
export const verifyOtp = async (phone, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { phone, otp });
    return response;
  } catch (error) {
    throw error.response || error;
  }
};
