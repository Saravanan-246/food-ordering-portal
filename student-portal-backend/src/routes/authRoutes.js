import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const router = express.Router();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.json({ success: false, message: "Phone required" });

  try {
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID) // 👈 FIXED
      .verifications.create({
        to: formattedPhone,
        channel: "sms",
      });

    return res.json({
      success: true,
      message: "OTP sent",
      verificationId: verification.sid,
    });

  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp)
    return res.json({ success: false, message: "Missing phone or OTP" });

  try {
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID) // 👈 FIXED
      .verificationChecks.create({
        to: formattedPhone,
        code: otp,
      });

    if (verificationCheck.status === "approved") {
      return res.json({
        success: true,
        message: "OTP Verified",
        token: "sample-jwt-token",
      });
    }

    return res.json({ success: false, message: "Invalid OTP" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
});

export default router;
