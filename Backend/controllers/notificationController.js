const Notification = require("../models/notification");

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


exports.markCategoryAsRead = async (req, res) => {
    try {
        const { type } = req.body;
        
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