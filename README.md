# CodeAlpha_SarvodayWatch

This project is a full-stack E-commerce web application developed as part of my internship at CodeAlpha.

## Project Description
Sarvoday Watch is a modern, responsive marketplace designed for premium timepieces. The application features a robust admin dashboard that allows for real-time inventory management, including specific product variants, pricing, and stock alerts.

## Key Features
- **Responsive E-commerce Interface:** A clean, modern UI for browsing luxury timepieces.
- **Variant-Centric Inventory:** Ability to manage colors, prices, and stock counts per item.
- **Admin Dashboard:** A dedicated management view with 'Low Stock' notifications to streamline inventory operations.
- **Modern Tech Stack:** Built using the MERN stack (MongoDB, Express.js, React, Node.js).

## Technologies Used
- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Version Control:** Git & GitHub

### Environment Variables Configuration

Before starting the backend server, create a `.env` file inside the `Backend/` directory and configure the following variables with your own local values:

```env
PORT = 5000
MONGO_URI = mongodb://127.0.0.1:27017/Sarvoday-Watch
JWT_SECRET = your_private_jwt_secret_string

## How to Run the Project
1. **Clone the repository:**
   `git clone https://github.com/priyanshi-abcd/CodeAlpha_SarvodayWatch.git`
2. **Setup Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. **Setup Backend:**
   - `cd Backend`
   - `npm install`
   - `npm start`
