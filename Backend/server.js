const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const path = require("path");

connectDB();

const app = express();
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads",express.static(path.join(__dirname,'uploads')));

const PORT = process.env.PORT || 5000;

app.use("/auth/api",require("./routes/authRoute"));
app.use("/api/admin",require("./routes/adminRoute"));
app.use("/api/admin/cart",require("./routes/cartRoute"));
app.use("/api/orders",require("./routes/orderRoute"));
app.use("/api/payment",require("./routes/PaymentRoute"));
app.use("/api/users",require("./routes/userRoute"));
app.use("/api/notifications",require("./routes/notificationRoute"));
app.use("/api/contact",require("./routes/contactRoute"));

app.get("/",(req,res)=>{
    res.send("This is Sarvoday watch-store");
});

app.get('/api/test-ping', (req, res) => {
    console.log("Ping received!");
    res.json({ status: "Success" });
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});