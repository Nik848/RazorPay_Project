import React, { useState } from 'react';
import { assignRole, assignManager } from '../api';
import { Shield, UserPlus, Link, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPanel() {
  const [roleForm, setRoleForm] = useState({ userId: '', role: 'EMP' });
  const [managerForm, setManagerForm] = useState({ employeeId: '', managerId: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loadingRole, setLoadingRole] = useState(false);
  const [loadingManager, setLoadingManager] = useState(false);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setLoadingRole(true);
    try {
      await assignRole(roleForm.userId, roleForm.role);
      showMessage('Role updated successfully', 'success');
      setRoleForm({ userId: '', role: 'EMP' });
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoadingRole(false);
    }
  };

  const handleManagerSubmit = async (e) => {
    e.preventDefault();
    setLoadingManager(true);
    try {
      await assignManager(managerForm.employeeId, managerForm.managerId);
      showMessage('Manager assigned successfully', 'success');
      setManagerForm({ employeeId: '', managerId: '' });
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoadingManager(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', background: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ background: 'rgba(177, 178, 255, 0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
          <Shield size={22} style={{ color: 'var(--primary)' }} />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Admin Controls</h3>
      </div>

      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
            style={{ 
              padding: '0.85rem 1rem', 
              borderRadius: '0.75rem', 
              marginBottom: '1.5rem', 
              fontSize: '0.9rem', 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '500',
              background: message.type === 'error' ? 'rgba(255,182,185,0.2)' : 'rgba(212,237,218,0.5)',
              color: message.type === 'error' ? 'var(--danger-text)' : 'var(--success-text)',
              border: `1px solid ${message.type === 'error' ? 'rgba(255,182,185,0.4)' : 'rgba(168,230,207,0.4)'}`
            }}
          >
            {message.type === 'error' ? <X size={16} /> : <Check size={16} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleRoleSubmit} style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.25rem', fontWeight: '600' }}>
          <UserPlus size={18} style={{ color: 'var(--primary)' }}/> Assign Role
        </h4>
        <div className="input-group" style={{ marginBottom: '1rem' }}>
          <label>User ID</label>
          <input type="number" min="1" placeholder="Enter User ID" required value={roleForm.userId} onChange={(e) => setRoleForm({ ...roleForm, userId: e.target.value })} />
        </div>
        <div className="input-group" style={{ marginBottom: '1.25rem' }}>
          <label>Role</label>
          <select value={roleForm.role} onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })} required>
            <option value="EMP">Employee (EMP)</option>
            <option value="RM">Reporting Manager (RM)</option>
            <option value="APE">Accounts Payable (APE)</option>
            <option value="CFO">CFO</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loadingRole}>
          {loadingRole ? 'Updating...' : 'Update Role'}
        </button>
      </form>

      <div style={{ borderTop: '1px solid var(--border-color)', margin: '2rem 0' }}></div>

      <form onSubmit={handleManagerSubmit}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.25rem', fontWeight: '600' }}>
          <Link size={18} style={{ color: 'var(--primary)' }}/> Assign Manager
        </h4>
        <div className="input-group" style={{ marginBottom: '1rem' }}>
          <label>Employee ID</label>
          <input type="number" min="1" placeholder="Enter Employee ID" required value={managerForm.employeeId} onChange={(e) => setManagerForm({ ...managerForm, employeeId: e.target.value })} />
        </div>
        <div className="input-group" style={{ marginBottom: '1.25rem' }}>
          <label>Manager ID</label>
          <input type="number" min="1" placeholder="Enter Manager ID" required value={managerForm.managerId} onChange={(e) => setManagerForm({ ...managerForm, managerId: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loadingManager}>
          {loadingManager ? 'Linking...' : 'Link Employees'}
        </button>
      </form>
    </div>
  );
}
