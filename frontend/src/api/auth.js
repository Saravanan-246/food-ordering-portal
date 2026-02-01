import API from "./api"; // axios instance using VITE_API_URL

// Send OTP
export const sendOtp = async (phone) => {
  const response = await API.post("/api/auth/send-otp", { phone });
  return response;
};

// Verify OTP
export const verifyOtp = async (phone, otp) => {
  const response = await API.post("/api/auth/verify-otp", { phone, otp });
  return response;
};
