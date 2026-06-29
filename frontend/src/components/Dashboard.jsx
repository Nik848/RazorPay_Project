import React, { useState, useEffect } from 'react';
import { getReimbursements, createReimbursement, updateReimbursementStatus } from '../api';
import AdminPanel from './AdminPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Clock, Check, X, Plus, FileText, LayoutDashboard, LogOut } from 'lucide-react';

const SkeletonCard = () => (
  <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem', border: 'none', background: '#ffffff' }}>
    <div className="skeleton" style={{ height: '1.5rem', width: '40%', marginBottom: '1rem' }}></div>
    <div className="skeleton" style={{ height: '1rem', width: '80%', marginBottom: '0.5rem' }}></div>
    <div className="skeleton" style={{ height: '1rem', width: '60%', marginBottom: '1.5rem' }}></div>
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div className="skeleton" style={{ height: '1rem', width: '20%' }}></div>
      <div className="skeleton" style={{ height: '1rem', width: '20%' }}></div>
    </div>
  </div>
);

export default function Dashboard({ user, onLogout }) {
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', description: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const fetchReimbursements = async () => {
    try {
      setLoading(true);
      const res = await getReimbursements();
      setReimbursements(res.data.reimbursements || []);
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      // Small timeout to show off the skeleton loading nicely
      setTimeout(() => setLoading(false), 600);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await createReimbursement(formData.title, formData.amount, formData.description);
      showMessage('Request submitted successfully', 'success');
      setFormData({ title: '', amount: '', description: '' });
      setShowCreate(false);
      fetchReimbursements();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateReimbursementStatus(id, status);
      showMessage(`Request ${status.toLowerCase()} successfully`, 'success');
      fetchReimbursements();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': 
        return <span style={{ padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--success-text)', background: 'var(--success)' }}>{status}</span>;
      case 'REJECTED': 
        return <span style={{ padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--danger-text)', background: 'rgba(255,182,185,0.4)' }}>{status}</span>;
      default: 
        return <span style={{ padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)', background: 'rgba(177, 178, 255, 0.2)' }}>{status}</span>;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', padding: '1rem 0' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', color: 'var(--text-main)' }}>
            <div style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-soft)' }}>
              <LayoutDashboard size={28} style={{ color: 'var(--primary)' }} />
            </div>
            Razorpay Reimbursements
          </h2>
          <p style={{ margin: '0.75rem 0 0 0', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Welcome back, <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</span> 
            <span style={{ padding: '0.2rem 0.6rem', background: '#f1f5f9', color: 'var(--text-muted)', borderRadius: '0.5rem', fontSize: '0.8rem', marginLeft: '0.75rem', fontWeight: '600' }}>Role: {user.role}</span>
          </p>
        </div>
        <button onClick={onLogout} className="btn btn-secondary" style={{ background: '#ffffff', boxShadow: 'var(--shadow-soft)' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ 
              padding: '1rem', 
              borderRadius: '0.75rem', 
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: '500',
              background: message.type === 'error' ? 'rgba(255,182,185,0.2)' : 'rgba(212,237,218,0.5)',
              color: message.type === 'error' ? 'var(--danger-text)' : 'var(--success-text)',
              border: `1px solid ${message.type === 'error' ? 'rgba(255,182,185,0.4)' : 'rgba(168,230,207,0.4)'}`
            }}
          >
            {message.type === 'error' ? <X size={20} /> : <Check size={20} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: user.role === 'CFO' ? '2fr 1.2fr' : '1fr', gap: '2.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} style={{ color: 'var(--primary)' }}/> My Requests
              </h3>
              {user.role === 'EMP' && (
                <button onClick={() => setShowCreate(true)} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                  <Plus size={18} /> New Request
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : reimbursements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                <div style={{ background: '#f8fafc', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <FileText size={24} style={{ color: '#cbd5e1' }} />
                </div>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>No reimbursements found.</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Create a new request to get started.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reimbursements.map(r => (
                  <motion.div 
                    key={r.id} 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      padding: '1.5rem', 
                      background: '#f8fafc', 
                      borderRadius: '1rem', 
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.2s ease'
                    }}
                    whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)' }}>{r.title}</h4>
                      {getStatusBadge(r.status)}
                    </div>
                    <p style={{ margin: '0 0 1.25rem 0', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{r.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}><IndianRupee size={16} style={{ color: 'var(--primary)' }}/> {r.amount}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={16}/> {new Date(r.createdAt).toLocaleDateString()}</span>
                        {r.employeeId && user.role !== 'EMP' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>User ID: {r.employeeId}</span>
                        )}
                      </div>
                      
                      {user.role !== 'EMP' && r.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button onClick={() => handleUpdateStatus(r.id, 'APPROVED')} className="btn btn-success" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}><Check size={16} /> Approve</button>
                          <button onClick={() => handleUpdateStatus(r.id, 'REJECTED')} className="btn btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}><X size={16} /> Reject</button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {user.role === 'CFO' && (
          <div>
            <AdminPanel />
          </div>
        )}

      </div>

      {/* Create Request Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="card"
              style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', background: '#ffffff', position: 'relative' }}
            >
              <button 
                onClick={() => setShowCreate(false)} 
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={24} />
              </button>
              
              <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={24} style={{ color: 'var(--primary)' }} /> Create Request
              </h3>
              
              <form onSubmit={handleCreate}>
                <div className="input-group">
                  <label>Title</label>
                  <input type="text" placeholder="E.g., Client Dinner" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Amount (₹)</label>
                  <div style={{ position: 'relative' }}>
                    <IndianRupee size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="number" step="0.01" min="1" placeholder="0.00" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea placeholder="Provide details about this expense..." rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="submit" className="btn btn-primary w-full" disabled={submitLoading}>
                    {submitLoading ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary w-full" disabled={submitLoading}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
