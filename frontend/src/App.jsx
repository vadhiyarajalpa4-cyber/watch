// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Component & Page Imports
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import About from './pages/About';
// import Auth from './pages/Auth';
// import Collection from './pages/Collection';
// import ProductDetail from './pages/ProductDetail';
// import Wishlist from './pages/Wishlist';
// import Cart from './pages/Cart';
// import Profile from './pages/Profile';
// import Checkout from './pages/Checkout';
// import PlaceOrder from './pages/PlcaeOrder';
// import OrderSuccess from './pages/OrderSuccess';

// // Admin Imports
// import AdminLayout from './components/AdminLayout';
// import AdminDashboard from './components/AdminDashboard';
// import ManageCategories from './pages/admin/ManageCategories';
// import ManageProducts from './pages/admin/ManageProducts';
// import ManageOrders from './pages/admin/ManageOrders';
// import UserListScreen from './components/UserListScreen';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* --- ADMIN ROUTES (No main Navbar/Footer) --- */}
//         <Route path="/admin" element={<AdminLayout />}>
//         {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
//         <Route index element={<AdminDashboard />} />
//           <Route path="categories" element={<ManageCategories />} />
//           <Route path="products" element={<ManageProducts />} />
//           <Route path="orders" element={<ManageOrders />} />
//           <Route path="userlist" element={<UserListScreen />} />

//         </Route>


//         {/* --- PUBLIC ROUTES (With Navbar/Footer) --- */}
//         <Route path="*" element={
//           <div className="flex flex-col min-h-screen bg-white">
//             <Navbar />
//             <main className="flex-grow">
//               <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/login" element={<Auth />} />

//                 {/* ADD THIS LINE HERE */}
//                 <Route path="/collection" element={<Collection />} />
//                 <Route path="/collection/:categoryName?" element={<Collection />} />
//                 <Route path="/products/:id" element={<ProductDetail />} />
//                 <Route path="/wishlist" element={<Wishlist />} />
//                 <Route path="/cart" element={<Cart />} />
//                 <Route path="/profile" element={<Profile />} />
//                 <Route path="/checkout" element={<Checkout />} />
//                 <Route path="/placeorder" element={<PlaceOrder />} />
//                 <Route path="/order-success/:id" element={<OrderSuccess/>} />

                

//                 {/* 404 Page */}
//                 <Route path="*" element={
//                   <div className="flex flex-col items-center justify-center py-32 font-serif text-center">
//                     <h1 className="text-6xl font-bold text-[#D4AF37] mb-4">404</h1>
//                     <p className="text-xl text-gray-600 uppercase tracking-widest italic">Time has slipped away.</p>
//                     <p className="text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
//                   </div>
//                 } />
//               </Routes>
//             </main>
//             <Footer />
//           </div>
//         } />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext'; // 👈 IMPORT THIS

// Component & Page Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import ResetPassword from './components/ResetPassword';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import PlaceOrder from './pages/PlcaeOrder';
import OrderSuccess from './pages/OrderSuccess';

// Admin Imports
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import UserListScreen from './components/UserListScreen';
import AdminInbox from './pages/admin/AdminInbox';

function App() {
  return (
    // --- WRAP THE ENTIRE APP HERE ---
    <NotificationProvider>
      <Router>
        <Routes>
          {/* --- ADMIN ROUTES --- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="userlist" element={<UserListScreen />} />
            <Route path="inbox" element={<AdminInbox />} />

          </Route>

          {/* --- PUBLIC ROUTES --- */}
          <Route path="*" element={
            <div className="flex flex-col min-h-screen bg-white">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact/>} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/collection/:categoryName?" element={<Collection />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/placeorder" element={<PlaceOrder />} />
                  <Route path="/order-success/:id" element={<OrderSuccess/>} />

                  {/* 404 Page */}
                  <Route path="*" element={
                    <div className="flex flex-col items-center justify-center py-32 font-serif text-center">
                      <h1 className="text-6xl font-bold text-[#D4AF37] mb-4">404</h1>
                      <p className="text-xl text-gray-600 uppercase tracking-widest italic">Time has slipped away.</p>
                      <p className="text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
                    </div>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;