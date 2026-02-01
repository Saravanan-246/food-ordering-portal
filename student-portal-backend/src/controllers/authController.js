// backend/src/controllers/authController.js

export const verifyOTPController = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone and OTP are required'
      });
    }

    const result = await verifyOTP(phone, otp);

    if (result.success) {
      // Generate a simple token (you can use JWT later)
      const token = Buffer.from(`${phone}:${Date.now()}`).toString('base64');
      
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
        user: { phone }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
