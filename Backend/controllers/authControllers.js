const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Notification = require("../models/notification");

exports.register = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingEmail = await User.findOne({ email: normalizedEmail });

        if (existingEmail) {
            return res.status(400).json({ message: "You already exist, please login!" });
        }

        // const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            isAdmin: isAdmin || false
        });

        // --- 🔔 NEW: CREATE ADMIN NOTIFICATION ---
        try {
            // Find an Admin to receive the alert
            const admin = await User.findOne({ isAdmin: true });
            if (admin) {
                await Notification.create({
                    recipient: admin._id,
                    type: 'NEW_USER',
                    message: `New Client Registered: ${name} (${normalizedEmail})`,
                    link: '/admin/userlist',
                    isRead:true
                });
                console.log("Admin Notification for New User Created");
            }
        } catch (notifyErr) {
            console.log("Admin Notification failed:", notifyErr.message);
        }

        // --- WELCOME EMAIL ---
        const welcomeMessage = `
            <div style="font-family: 'serif'; padding: 40px; border: 1px solid #f0f0f0; max-width: 600px; margin: auto;">
                <h1 style="text-transform: uppercase; letter-spacing: 5px; text-align: center; color: #1a1a1a;">Welcome to the Vault</h1>
                <p style="text-align: center; color: #D4AF37; font-style: italic;">The world of fine horology awaits you.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                <p>Dear ${name},</p>
                <p>Thank you for registering with <strong>Sarvoday Watch Co.</strong> Your account is now active. You can now explore our exclusive collections and manage your acquisitions from your personal vault.</p>
                <div style="text-align: center; margin-top: 40px;">
                    <a href="http://localhost:5173/collections" style="background: black; color: white; padding: 12px 25px; text-decoration: none; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Start Exploring</a>
                </div>
                <p style="margin-top: 40px; font-size: 10px; color: #999; text-align: center;">Authenticity Guaranteed | Ahmedabad, India</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to Sarvoday Watch Co.',
                message: welcomeMessage,
            });
        } catch (mailErr) {
            console.log("Welcome email failed to send:", mailErr.message);
        }

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({ message: "User not found. Register First!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password Not Matched!" });
        }

        const token = await jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // --- OPTIONAL: LOGIN ALERT EMAIL ---
        const loginMessage = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <p>Hello ${user.name},</p>
                <p>Your <strong>Sarvoday Watch Co.</strong> account was just accessed at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}.</p>
                <p style="font-size: 12px; color: #666;">If this wasn't you, please reset your password immediately.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'New Login Detected - Sarvoday Watch Co.',
                message: loginMessage,
            });
        } catch (mailErr) {
            console.log("Login notification failed to send:", mailErr.message);
        }

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // .select("+password") ensures the hashed password is fetched from DB
        const user = await User.findById(req.user._id).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if currentPassword actually exists in the request
        if (!currentPassword) {
            return res.status(400).json({ message: "Current password is required" });
        }

        // This is where the error happens if currentPassword or user.password is missing
        const isMatch = await user.comparePassword(currentPassword);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save();

        // Change this line
const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        // const message = `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.`;
        const message = `
  <div style="font-family: serif; border: 1px solid #e2e8f0; padding: 20px; max-width: 600px;">
    <h2 style="color: #1a1a1a; text-transform: uppercase;">Password Reset Request</h2>
    <div style="width: 50px; height: 2px; background-color: #D4AF37; margin-bottom: 20px;"></div>
    <p>You requested a password reset for your <strong>Sarvoday Watch Co.</strong> account.</p>
    <p>Please click the button below to set a new password. This link is valid for 15 minutes.</p>
    <a href="${resetUrl}" style="background-color: #1a1a1a; color: #D4AF37; padding: 12px 24px; text-decoration: none; font-weight: bold; display: inline-block; margin: 20px 0;">
      RESET PASSWORD
    </a>
    <p style="font-size: 12px; color: #718096; margin-top: 20px;">
      If you did not request this, please ignore this email.
    </p>
  </div>
`;

        // --- ACTUAL EMAIL SENDING ---
        await sendEmail({
            email: user.email,
            subject: 'Reset Your Password - Sarvoday Watch Co.',
            message: message
        });

        res.json({ message: "Email sent successfully! Check your inbox." });

    } catch (err) {
        // If email fails, don't leave the token in the DB
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
        }
        res.status(500).json({ message: "Email could not be sent. Please try again later." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        // 1. Hash the token from the URL to compare with DB
        const resetToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // 2. Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // 3. Update password (ensure it's hashed by your model's middleware)
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: "Password reset successful! You can now login." });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
