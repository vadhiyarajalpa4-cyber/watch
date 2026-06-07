const Contact = require("../models/contact");
const Notification = require("../models/notification");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/user");

exports.createInquiry = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const inquiry = await Contact.create({
            name,
            email,
            subject,
            message
        });

        const admin = await User.findOne({ isAdmin: true });
        if (admin) {
            await Notification.create({
                recipient: admin._id,
                type: 'NEW_INQUIRY',
                message: `New message from ${name}: ${subject}`,
                link: '/admin/inbox',
                isRead:true 
            });
        }

        res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
        console.error("!!! BACKEND CRASH !!!");
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to send message", 
            error: error.message 
        });
    }
};

exports.getInquiries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalInquiries = await Contact.countDocuments({});
        const inquiries = await Contact.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            inquiries,
            currentPage: page,
            totalPages: Math.ceil(totalInquiries / limit),
            totalInquiries
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching inquiries" });
    }
};


exports.updateInquiryStatus = async (req, res) => {
    try {
        const inquiry = await Contact.findById(req.params.id);

        if (inquiry) {
            inquiry.status = req.body.status || inquiry.status;
            const updatedInquiry = await inquiry.save();
            res.json(updatedInquiry);
        } else {
            res.status(404).json({ message: "Inquiry not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Contact.findById(req.params.id);
        if (inquiry) {
            await inquiry.deleteOne();
            res.json({ message: "Inquiry removed from vault" });
        } else {
            res.status(404).json({ message: "Inquiry not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.replyToInquiry = async (req, res) => {
    const { replyMessage } = req.body;

    try {
        const inquiry = await Contact.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }

        await sendEmail({
            email: inquiry.email,
            subject: `Re: ${inquiry.subject} - Sarvoday Watch Store`,
            message: `
                <div style="font-family: serif; padding: 20px; color: #111;">
                    <h2 style="color: #D4AF37; border-b: 1px solid #eee; padding-bottom: 10px;">SARVODAY</h2>
                    
                    <p style="line-height: 1.6; color: #333; font-family: sans-serif;">
                        ${replyMessage.replace(/\n/g, '<br>')}
                    </p>
                    
                    <br />
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
                        Sarvoday Concierge Team<br />
                        Nikol, Ahmedabad, India
                    </p>
                </div>
            `
        });

        inquiry.status = "Resolved";
        await inquiry.save();

        res.status(200).json({ success: true, message: "Reply dispatched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send reply", error: error.message });
    }
};