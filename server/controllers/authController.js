import Farmer from "../models/Farmer.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendEmail from "../utils/mailer.js";

dotenv.config();

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

/* =====================================================================
    FARMER SIGNUP
===================================================================== */
export const farmerSignup = async (req, res) => {
  console.log("SIGNUP BODY:", req.body);

  try {
    const { name, phone, password, state, email, language } = req.body;

    if (!name || !phone || !password || !state) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Farmer.findOne({ phone });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Farmer with this phone already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const farmer = new Farmer({
      name,
      phone,
      password: hashed,
      state,
      email: email || null,
      language: language || "en",
      lastLogin: new Date(),
    });

    await farmer.save();

    const token = signToken({ id: farmer._id, role: "farmer" });

    res.json({
      token,
      farmer: { id: farmer._id, name: farmer.name },
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================================
    FARMER LOGIN
===================================================================== */
export const farmerLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    const farmer = await Farmer.findOne({ phone });
    if (!farmer) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }

    if (!farmer.active) {
      return res.status(403).json({
        message: "Your account has been deactivated. Contact support.",
      });
    }

    const ok = await bcrypt.compare(password, farmer.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }

    farmer.lastLogin = new Date();
    await farmer.save();

    const token = signToken({ id: farmer._id, role: "farmer" });

    return res.json({
      token,
      farmer: {
        id: farmer._id,
        name: farmer.name,
        phone: farmer.phone,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================================
    FORGOT PASSWORD — SEND OTP (RESEND)
===================================================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body; // email OR phone

    if (!identifier) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    const farmer = await Farmer.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    // Generic response to hide account existence
    if (!farmer) {
      return res.json({
        success: true,
        message: "If account exists, OTP has been sent.",
      });
    }

    // Create OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    farmer.resetOtp = otp;
    farmer.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    farmer.resetOtpAttempts = 0;

    await farmer.save();

    // Build template (unchanged)
    const htmlEmail = getOtpEmailTemplate({
      OTP: otp,
      USER_EMAIL: farmer.email,
      YEAR: new Date().getFullYear(),
    });

    // SEND USING RESEND
    await sendEmail({
      to: farmer.email,
      subject: "Farm2Gov — Reset Password OTP",
      html: htmlEmail,
      text: `Your OTP is ${otp} (valid for 10 minutes).`,
    });

    return res.json({
      success: true,
      message: "If account exists, OTP has been sent.",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================================
    VERIFY OTP
===================================================================== */
export const verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ message: "Identifier and OTP required" });
    }

    const farmer = await Farmer.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!farmer)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    if (!farmer.resetOtp || farmer.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (farmer.resetOtp !== otp) {
      farmer.resetOtpAttempts += 1;
      await farmer.save();
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================================
    RESET PASSWORD USING OTP
===================================================================== */
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const farmer = await Farmer.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (
      !farmer ||
      !farmer.resetOtp ||
      farmer.resetOtp !== otp ||
      farmer.resetOtpExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    farmer.password = hashed;
    farmer.resetOtp = null;
    farmer.resetOtpExpires = null;
    farmer.resetOtpAttempts = 0;

    await farmer.save();

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================================
    ADMIN LOGIN
===================================================================== */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ id: admin._id, role: "admin" });

    return res.json({
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================================
    EMAIL TEMPLATE FUNCTION (UNTOUCHED)
===================================================================== */
function getOtpEmailTemplate({ OTP, USER_EMAIL, YEAR }) {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Farm2Gov — Reset Password OTP</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
  <div style="display:none; max-height:0; overflow:hidden;">Your OTP for Farm2Gov — valid for 10 minutes.</div>

  <table width="100%" style="background:#f4f6f8; padding:24px 16px;">
    <tr><td align="center">
      <table width="500" style="background:white; border-radius:12px; overflow:hidden;">
        
        <tr>
          <td style="padding:20px 24px; background:linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 0%, rgba(0, 149, 58, 1) 100%); color:white;">
            <table width="100%">
              <tr>
                <td><img src="https://ik.imagekit.io/h4zyjrlj5/logo.png" width="160" style="border-radius:6px;" /></td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px;">
            <h1 style="margin:0; font-size:22px;">Reset your password</h1>
            <p style="color:#475569;">Use the OTP below to reset your Farm2Gov password.</p>

            <div style="text-align:center; margin-top:20px;">
              <div style="display:inline-block; background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:16px 22px;">
                <p style="font-size:28px; margin:0; letter-spacing:6px; font-weight:bold;">${OTP}</p>
              </div>
              <p style="color:#64748b; margin-top:6px;">Valid for 10 minutes</p>
            </div>

            <p style="font-size:13px; color:#475569; margin-top:20px; text-align:center;">
              Enter this OTP in the app to proceed.
            </p>

            <hr style="margin:20px 0; border:0; border-top:1px solid #e2e8f0;" />

            <p style="font-size:13px; color:#64748b;">
              Didn’t request a reset? Ignore this email.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f8fafc; padding:18px; text-align:center; font-size:12px; color:#94a3b8;">
            Farm2Gov © ${YEAR}.  
            <br/>Sent to: <b>${USER_EMAIL}</b>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
