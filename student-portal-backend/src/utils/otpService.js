// student-portal-backend/src/services/otpService.js
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Get credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Debug logs
console.log('🔍 Twilio Config:');
console.log('Account SID:', accountSid);
console.log('Auth Token:', authToken ? '✅ Loaded' : '❌ Missing');
console.log('Verify SID:', verifySid);

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Send OTP to phone number
 */
export const sendOTP = async (phone) => {
  try {
    console.log(`📱 Sending OTP to ${phone}...`);

    const verification = await client.verify.v2
      .services(verifySid)
      .verifications
      .create({
        to: phone,
        channel: 'sms'
      });

    console.log('✅ OTP sent successfully!');
    console.log('Status:', verification.status);

    return {
      success: true,
      message: 'OTP sent successfully',
      sid: verification.sid,
      expiresIn: 600 // 10 minutes
    };

  } catch (error) {
    console.error('❌ Twilio Error:', error.message);
    
    return {
      success: false,
      message: error.message || 'Failed to send OTP'
    };
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (phone, otp) => {
  try {
    console.log(`🔐 Verifying OTP for ${phone}...`);

    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks
      .create({
        to: phone,
        code: otp
      });

    if (verificationCheck.status === 'approved') {
      console.log('✅ OTP verified successfully!');
      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } else {
      console.log('❌ Invalid OTP');
      return {
        success: false,
        message: 'Invalid or expired OTP'
      };
    }

  } catch (error) {
    console.error('❌ Verification Error:', error.message);
    
    return {
      success: false,
      message: 'Invalid OTP'
    };
  }
};
