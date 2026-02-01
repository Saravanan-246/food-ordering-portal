// src/pages/Login.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!phone.trim()) {
      setError("Please enter mobile number");
      return;
    }

    if (phone.length !== 10) {
      setError("Mobile number must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = `+91${phone}`;
      const response = await sendOtp(formattedPhone);

      if (response?.data?.success) {
        navigate("/otp-verification", {
          state: { phone: formattedPhone },
        });
      } else {
        setError(response?.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Login error:", err);

      // ✅ show backend error if available
      setError(
        err?.response?.data?.message ||
        "Server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: use onKeyDown instead of onKeyPress
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Background>
      <Card>
        <Title>Student Login</Title>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <InputGroup>
          <CountryPrefix>+91</CountryPrefix>

          <InputWrapper>
            <Input
              placeholder=" "
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={10}
              disabled={loading}
            />
            <Label>Mobile Number</Label>
            <UnderlineBase />
            <UnderlineAnimated $isFocused={isFocused} />
          </InputWrapper>
        </InputGroup>

        <Button
          onClick={handleLogin}
          disabled={loading || phone.length !== 10}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>

        <InfoText>You will receive a 4-digit code</InfoText>
      </Card>
    </Background>
  );
}

// Styled Components

const Background = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #eef4ff, #ffffff);
`;


const Card = styled.div`
  background: #fff;
  padding: 36px 30px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  width: 100%;
  max-width: 400px;
  box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.06);
`;


const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 26px;
  color: #0f172a;
`;


const ErrorMsg = styled.p`
  color: #dc2626;
  background: #fee;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 16px;
  font-size: 13px;
`;


const InputGroup = styled.div`
  position: relative;
  margin-bottom: 26px;
  display: flex;
  align-items: center;
  gap: 8px;
`;


const CountryPrefix = styled.div`
  font-size: 15px;
  color: #64748b;
  font-weight: 500;
`;


const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;


const Input = styled.input`
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 15px;
  background: transparent;
  outline: none;


  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }


  &:focus + label,
  &:not(:placeholder-shown) + label {
    transform: translateY(-20px);
    font-size: 12px;
    color: #2563eb;
  }
`;


const Label = styled.label`
  position: absolute;
  left: 0;
  top: 10px;
  color: #64748b;
  font-size: 14px;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;


const UnderlineBase = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #cbd5e1;
`;


const UnderlineAnimated = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
  width: ${({ $isFocused }) => ($isFocused ? "100%" : "0%")};
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;


const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;


  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-2px);
  }


  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;


const InfoText = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
  margin-top: 16px;
`;
