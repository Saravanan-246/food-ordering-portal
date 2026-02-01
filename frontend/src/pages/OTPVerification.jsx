// src/pages/OTPVerification.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, sendOtp } from "../api/auth";

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) {
      navigate("/login", { replace: true });
    }
  }, [phone, navigate]);

  const [otp, setOtp] = useState(["", "", "", ""]); // 4 DIGITS
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto verify when 4 digits filled
  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === 4 && !isVerifying) {
      handleVerify(otpString);
    }
  }, [otp, isVerifying]);

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];

    // Handle paste
    if (value.length > 1) {
      const pastedData = value.slice(0, 4).split("");
      pastedData.forEach((char, i) => {
        if (index + i < 4) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedData.length, 3);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = useCallback(
    async (otpString = otp.join("")) => {
      if (!otpString || otpString.length !== 4) {
        setError("Please enter 4-digit OTP");
        return;
      }

      setIsVerifying(true);
      setError("");
      setSuccess("");

      try {
        const { data } = await verifyOtp(phone, otpString);

        if (data.success) {
          setSuccess("OTP verified! Redirecting...");
          
          const token = data.token || `token_${phone}_${Date.now()}`;
          localStorage.setItem("authToken", token);
          localStorage.setItem("userPhone", phone);
          localStorage.setItem("isLoggedIn", "true");

          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        } else {
          setError(data.message || "Invalid OTP");
          setOtp(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Network error. Try again.");
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      } finally {
        setIsVerifying(false);
      }
    },
    [otp, phone, navigate]
  );

  const handleResend = async () => {
    if (timeLeft > 0 || isResending) return;

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await sendOtp(phone);

      if (data.success) {
        setSuccess("OTP sent!");
        setOtp(["", "", "", ""]);
        setTimeLeft(60);
        inputRefs.current[0]?.focus();
        
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to resend OTP");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Background>
      <Card>
        <Title>OTP Verification</Title>
        <Subtitle>
          Code sent to <Phone>{phone}</Phone>
        </Subtitle>

        {error && <ErrorMsg>{error}</ErrorMsg>}
        {success && <SuccessMsg>{success}</SuccessMsg>}

        <OTPContainer>
          {otp.map((digit, index) => (
            <OTPInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isVerifying}
              autoFocus={index === 0}
              hasValue={digit !== ""}
            />
          ))}
        </OTPContainer>

        <TimerContainer>
          {timeLeft > 0 ? (
            <TimerText>
              Resend in <TimeSpan>{formatTime(timeLeft)}</TimeSpan>
            </TimerText>
          ) : (
            <ResendButton onClick={handleResend} disabled={isResending}>
              {isResending ? "Sending..." : "Resend Code"}
            </ResendButton>
          )}
        </TimerContainer>

        <Button
          onClick={() => handleVerify()}
          disabled={isVerifying || otp.join("").length !== 4}
        >
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </Button>

        <BackLink onClick={() => navigate("/login", { replace: true })}>
          Change Number
        </BackLink>
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
  margin-bottom: 8px;
  color: #0f172a;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 26px;
`;

const Phone = styled.strong`
  color: #2563eb;
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

const SuccessMsg = styled.p`
  color: #16a34a;
  background: #f0fdf4;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 16px;
  font-size: 13px;
`;

const OTPContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
`;

const OTPInput = styled.input`
  width: 50px;
  height: 56px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  border: 2px solid ${(props) => (props.hasValue ? "#2563eb" : "#cbd5e1")};
  border-radius: 10px;
  background: ${(props) => (props.hasValue ? "#eff6ff" : "#fff")};
  color: #0f172a;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #2563eb;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TimerContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
  min-height: 24px;
`;

const TimerText = styled.p`
  color: #64748b;
  font-size: 13px;
  margin: 0;
`;

const TimeSpan = styled.span`
  color: #dc2626;
  font-weight: 600;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const BackLink = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: #64748b;
  font-size: 13px;
  margin-top: 16px;
  cursor: pointer;
  padding: 8px;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;
