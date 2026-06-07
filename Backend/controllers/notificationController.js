const Notification = require("../models/notification");

// 1. Get all notifications for the logged-in user/admin
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Mark specific category as read (e.g., when you click 'Registered Clients')
// exports.markCategoryAsRead = async (req, res) => {
//     try {
//         const { type } = req.body; // e.g., 'NEW_USER' or 'NEW_ORDER'
//         await Notification.updateMany(
//             { recipient: req.user._id, type: type, isRead: false },
//             { $set: { isRead: true } }
//         );
//         res.json({ message: `${type} notifications marked as read` });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// Inside your backend notificationController.js
exports.markCategoryAsRead = async (req, res) => {
    try {
        const { type } = req.body; // e.g., 'NEW_ORDER'
        
        // Match how your data actually looks: find the active 'true' entries and flip them to 'false'
        const result = await Notification.updateMany(
            { recipient: req.user._id, type: type, isRead: true }, 
            { $set: { isRead: false } }
        );

        console.log(`Matched ${result.matchedCount} and modified ${result.modifiedCount} docs.`);
        
        res.json({ message: `${type} notifications marked as read successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};