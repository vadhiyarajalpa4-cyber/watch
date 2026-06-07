const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("./models/user"); 
const connectDB = require("./config/db");

dotenv.config();

const importAdmin = async () => {
    try {
        await connectDB();

        console.log("Checking for existing admin...");
        const adminExists = await User.findOne({ email: process.env.INITIAL_ADMIN_EMAIL });

        if (adminExists) {
            console.log("ℹAdmin account already exists. No action taken.");
            process.exit();
        }
        const hashedPassword = await bcrypt.hash(process.env.INITIAL_ADMIN_PASSWORD,10);

        await User.create({
            name: "Master Admin",
            email: process.env.INITIAL_ADMIN_EMAIL,
            password: hashedPassword,
            isAdmin: true,
        });

        console.log("Admin Created Successfully!");
        process.exit();
    } catch (err) {
        console.error(`Error with seeding: ${err.message}`);
        process.exit(1);
    }
};

importAdmin();