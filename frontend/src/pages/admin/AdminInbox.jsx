import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Clock, User, MessageSquare, CheckCircle, Trash2, X, Send, Loader2 } from 'lucide-react';

const AdminInbox = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const getAuthConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
  };

  const fetchInquiries = async (page = 1) => {
    setLoading(true);
    try {
      const config = getAuthConfig();
      const { data } = await axios.get(`http://localhost:5000/api/contact?page=${page}&limit=${itemsPerPage}`, config);
      setInquiries(data.inquiries);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      console.error("Failed to load inquiries", err);
    }
    setLoading(false);
  };

  const changePage = (newPage) => {
    setCurrentPage(newPage);
    fetchInquiries(newPage);
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleResolve = async (id) => {
    try {
      const config = getAuthConfig();
      await axios.put(`http://localhost:5000/api/contact/${id}`, { status: 'Resolved' }, config);
      setInquiries(prev => prev.map(msg => msg._id === id ? { ...msg, status: 'Resolved' } : msg));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this inquiry permanently?")) {
      try {
        const config = getAuthConfig();
        await axios.delete(`http://localhost:5000/api/contact/${id}`, config);
        setInquiries(prev => prev.filter(msg => msg._id !== id));
      } catch (err) { console.error(err); }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    setSendingReply(true);
    try {
      const config = getAuthConfig();
      await axios.post(`http://localhost:5000/api/contact/${selectedInquiry._id}/reply`, { replyMessage: replyText }, config);

      setInquiries(prev => prev.map(msg => msg._id === selectedInquiry._id ? { ...msg, status: 'Resolved' } : msg));

      setSelectedInquiry(null);
      setReplyText('');
      alert("Reply sent successfully from Sarvoday Account!");
    } catch (err) {
      console.error("Failed to send reply email", err);
      alert("Error sending email. Check your backend configurations.");
    }
    setSendingReply(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'In-Progress': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) return <div className="p-10 text-center font-sans tracking-widest text-[10px] uppercase">Opening Vault...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans relative">
      <div className="flex justify-between items-end mb-10 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-serif tracking-widest uppercase">Inquiry Vault</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Manage client communication</p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-3 py-1">
          {inquiries.length} Messages
        </div>
      </div>

      <div className="grid gap-6">
        {inquiries.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200">
            <p className="text-xs text-gray-400 uppercase tracking-widest">No inquiries found</p>
          </div>
        ) : (
          inquiries.map((msg) => (
            <div key={msg._id} className="group bg-white border border-gray-100 p-6 hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-500">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#D4AF37] transition-colors">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-tight">{msg.name}</h3>
                    <p className="text-xs text-gray-400">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 border ${getStatusColor(msg.status)}`}>
                    {msg.status}
                  </span>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="pl-14">
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-widest block mb-1">Subject: {msg.subject}</span>
                  <p className="text-sm text-gray-600 leading-relaxed italic">"{msg.message}"</p>
                </div>

                <div className="flex gap-4 border-t border-gray-50 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setSelectedInquiry(msg);
                      setReplyText(`Dear ${msg.name},\n\nThank you for reaching out to Sarvoday Watch Store.\n\n`);
                    }}
                    className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-black hover:text-[#D4AF37]"
                  >
                    <MessageSquare size={14} /> Reply via Dashboard
                  </button>

                  {msg.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolve(msg._id)}
                      className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      <CheckCircle size={14} /> Mark Resolved
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- LUXURY CONCIERGE REPLY MODAL --- */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-2xl border border-gray-100 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">

            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="font-serif text-lg tracking-widest uppercase">Compose Response</h2>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">To: {selectedInquiry.name} ({selectedInquiry.email})</p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-black transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Original Inquiry Subject</label>
                <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-tight">
                  {selectedInquiry.subject}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Your Professional Message</label>
                <textarea
                  rows="8" required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full border border-gray-200 p-4 outline-none text-sm focus:border-[#D4AF37] transition font-sans resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-6 py-3 border border-gray-200 text-[10px] uppercase tracking-widest font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="px-8 py-3 bg-black text-white text-[10px] uppercase tracking-[0.15em] font-bold flex items-center gap-2 hover:bg-[#D4AF37] transition duration-300 disabled:opacity-50"
                >
                  {sendingReply ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                  {sendingReply ? 'Dispatching...' : 'Send Official Mail'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-12 py-6 border-t border-gray-50">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-[10px] text-gray-300">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminInbox;