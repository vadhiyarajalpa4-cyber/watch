import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, PackageCheck, X, CheckCircle2, Clock, Search, Truck, Trash2 } from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchAllOrders = async (page = 1) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      // Pass query params to the backend
      const { data } = await axios.get(
        `http://localhost:5000/api/orders?page=${page}&limit=${itemsPerPage}`,
        config
      );

      setOrders(data.orders);
      setFilteredOrders(data.orders);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders", err);
      setLoading(false);
    }
  };

  // 3. Update your initial load
  useEffect(() => {
    fetchAllOrders(1);
  }, []);

  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      result = result.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      if (statusFilter === 'Delivered') {
        result = result.filter(order => order.isDelivered);
      } else if (statusFilter === 'Shipping') {
        result = result.filter(order => order.isShipped && !order.isDelivered);
      } else if (statusFilter === 'Processing') {
        result = result.filter(order => !order.isShipped && !order.isDelivered);
      }
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const deliverHandler = async (id) => {
    if (window.confirm("Confirm delivery and payment collection for this order?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, config);
        await fetchAllOrders();

        if (selectedOrder && selectedOrder._id === id) {
          const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
          setSelectedOrder(data);
        }
      } catch (err) {
        alert("Status update failed.");
      }
    }
  };

  const shipHandler = async (id) => {
    if (window.confirm("Mark this order as Shipped?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`http://localhost:5000/api/orders/${id}/ship`, {}, config);
        fetchAllOrders();
      } catch (err) {
        alert("Shipping update failed.");
      }
    }
  };

  const deleteOrderHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        await axios.delete(`http://localhost:5000/api/orders/${id}`, config);

        // Refresh the list
        fetchAllOrders(currentPage);
        alert("Order deleted successfully.");
      } catch (err) {
        alert(err.response?.data?.message || "Delete failed.");
      }
    }
  };

  const viewDetailsHandler = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 pb-20 font-serif relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-3xl tracking-widest uppercase">Master Order Log</h1>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-sans">Global Inventory Movement</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto font-sans">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search ID or Client..."
              className="pl-10 pr-4 py-2 border border-gray-200 text-[11px] uppercase tracking-widest focus:border-[#D4AF37] outline-none w-full sm:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex border border-gray-200 p-1 rounded-sm bg-gray-50">
            {['All', 'Processing', 'Shipping', 'Delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1 text-[9px] uppercase tracking-widest font-bold transition-all ${statusFilter === status
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-400 hover:text-black'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Settled Revenue</p>
          <p className="text-xl font-sans font-bold text-[#D4AF37]">
            ₹{orders.filter(o => o.isPaid).reduce((acc, item) => acc + item.totalPrice, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-sm shadow-sm border border-gray-100">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 bg-gray-50/50">
              <th className="py-5 px-6">Order ID</th>
              <th className="py-5 px-6">Client</th>
              <th className="py-5 px-6 text-center">Payment Status</th>
              <th className="py-5 px-6 text-right">Valuation</th>
              <th className="py-5 px-6 text-center">Logistics</th>
              <th className="py-5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-20 text-gray-400 italic">Accessing Ledger...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-20 text-gray-400 uppercase tracking-widest text-xs">No matching orders found</td></tr>
            ) : filteredOrders.map((order) => (
              <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-6 px-6 font-medium text-xs tracking-tighter">#{order._id.slice(-8).toUpperCase()}</td>
                <td className="py-6 px-6 text-gray-600">
                  <p className="font-semibold">{order.user?.name || 'Deleted User'}</p>
                  <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                </td>

                {/* 1. PAYMENT STATUS COLUMN */}
                <td className="py-6 px-6 text-center">
                  <div className="flex flex-col items-center gap-1">
                    {order.isPaid ? (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-green-600 uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <CheckCircle2 size={10} /> Received
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1 text-[9px] font-bold uppercase px-3 py-1 rounded-full border ${order.paymentMethod === 'Cash on Delivery'
                        ? 'text-blue-500 bg-blue-50 border-blue-100'
                        : 'text-orange-500 bg-orange-50 border-orange-100'
                        }`}>
                        <Clock size={10} /> {order.paymentMethod === 'Cash on Delivery' ? 'COD Pending' : 'Wait Payment'}
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-6 px-6 text-right font-bold">₹{order.totalPrice.toLocaleString()}</td>

                {/* 2. LOGISTICS STATUS COLUMN (FIXED) */}
                <td className="py-6 px-6 text-center">
                  <div className="flex flex-col items-center gap-1">
                    {order.isDelivered ? (
                      <>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-green-600 uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
                          <PackageCheck size={10} /> Delivered
                        </span>
                        <span className="text-[8px] text-gray-400 font-sans uppercase">Package Received</span>
                      </>
                    ) : order.isShipped ? (
                      <>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-blue-500 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          <Truck size={10} /> Shipping
                        </span>
                        <span className="text-[8px] text-gray-400 font-sans uppercase">In Transit</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-[#D4AF37] uppercase bg-[#D4AF37]/5 px-3 py-1 rounded-full border border-[#D4AF37]/20">
                          <Clock size={10} /> Processing
                        </span>
                        <span className="text-[8px] text-gray-400 font-sans uppercase">Order Confirmed</span>
                      </>
                    )}
                  </div>
                </td>

                <td className="py-6 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => viewDetailsHandler(order)} className="p-2 text-gray-400 hover:text-black">
                      <Eye size={18} />
                    </button>

                    {!order.isShipped && !order.isDelivered && (
                      <button
                        onClick={() => shipHandler(order._id)}
                        className="p-2 text-blue-400 hover:text-blue-600"
                        title="Mark as Shipped"
                      >
                        <Truck size={18} />
                      </button>
                    )}

                    {order.isShipped && !order.isDelivered && (
                      <button
                        onClick={() => deliverHandler(order._id)}
                        className="p-2 text-gray-400 hover:text-green-600"
                        title="Confirm Delivery"
                      >
                        <PackageCheck size={18} />
                      </button>
                    )}
                    {/* New Delete Button */}
                    <button
                      onClick={() => deleteOrderHandler(order._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete Order"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 font-sans">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchAllOrders(currentPage - 1)}
              className="px-4 py-2 border text-[10px] uppercase tracking-widest disabled:opacity-30"
            >
              Previous
            </button>

            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchAllOrders(currentPage + 1)}
              className="px-4 py-2 border text-[10px] uppercase tracking-widest disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-8 relative rounded-sm shadow-2xl border border-gray-200">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={20} />
            </button>
            <h2 className="text-xl uppercase tracking-widest mb-6 border-b pb-4">Order Intelligence</h2>

            <div className="grid grid-cols-2 gap-8 mb-8 text-[11px] uppercase tracking-wider font-sans">
              <div>
                <p className="text-gray-400 mb-1">Customer</p>
                <p className="font-bold">{selectedOrder.user?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Logistics Status</p>
                <p className={`font-bold ${selectedOrder.isDelivered ? 'text-green-600' : 'text-orange-500'}`}>
                  {selectedOrder.isDelivered ? 'Delivered' : selectedOrder.isShipped ? 'Shipping' : 'Processing'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase mb-4">Item Catalog Summary</p>
              {selectedOrder.orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2 font-sans text-xs">
                  <span>{item.name} x {item.qty}</span>
                  <span className="font-bold">₹{item.price.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-[#D4AF37]">
                <span>TOTAL VALUATION</span>
                <span>₹{selectedOrder.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;