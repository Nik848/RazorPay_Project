import React, { useState, useEffect, useRef } from 'react';
import { assignRole, assignManager, getEmployees } from '../api';
import { Shield, UserPlus, Link, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Autocomplete = ({ label, value, onChange, options, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value));
  
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(String(value).toLowerCase()) || 
    String(opt.value).includes(String(value))
  );

  return (
    <div className="input-group" ref={wrapperRef} style={{ position: 'relative', marginBottom: '1.25rem' }}>
      <label>
        {label} 
        {value && <span style={{ color: 'var(--primary)', fontWeight: 'normal', marginLeft: '0.5rem', fontSize: '0.85em' }}>
          — {selectedOption?.label || 'Not Found'}
        </span>}
      </label>
      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        autoComplete="off"
        style={{ width: '100%' }}
      />
      
      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.ul 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.75rem',
              boxShadow: 'var(--shadow-hover)',
              maxHeight: '200px',
              overflowY: 'auto',
              margin: '0.25rem 0 0 0',
              padding: 0,
              listStyle: 'none',
              zIndex: 10
            }}
          >
            {filteredOptions.map((opt, index) => (
              <li
                key={opt.value}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderBottom: index === filteredOptions.length - 1 ? 'none' : '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => {
                  onChange(String(opt.value));
                  setIsOpen(false);
                }}
              >
                <div style={{ fontWeight: '500' }}>{opt.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {opt.value}</div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AdminPanel() {
  const [roleForm, setRoleForm] = useState({ userId: '', role: 'EMP' });
  const [managerForm, setManagerForm] = useState({ employeeId: '', managerId: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loadingRole, setLoadingRole] = useState(false);
  const [loadingManager, setLoadingManager] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getEmployees()
      .then(res => {
        if (res.data && res.data.users) {
          setUsers(res.data.users);
        }
      })
      .catch(err => console.error("Failed to load users:", err));
  }, []);

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
        
        <Autocomplete 
          label="User ID"
          placeholder="Enter User ID"
          value={roleForm.userId}
          onChange={(val) => setRoleForm({ ...roleForm, userId: val })}
          options={users.map(u => ({ label: u.name, value: u.userId }))}
          required
        />
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
        <Autocomplete 
          label="Employee ID"
          placeholder="Enter Employee ID"
          value={managerForm.employeeId}
          onChange={(val) => setManagerForm({ ...managerForm, employeeId: val })}
          options={users.filter(u => u.role === 'EMP').map(u => ({ label: u.name, value: u.userId }))}
          required
        />
        <Autocomplete 
          label="Manager ID"
          placeholder="Enter Manager ID"
          value={managerForm.managerId}
          onChange={(val) => setManagerForm({ ...managerForm, managerId: val })}
          options={users.filter(u => u.role === 'RM').map(u => ({ label: u.name, value: u.userId }))}
          required
        />
        <button type="submit" className="btn btn-primary w-full" disabled={loadingManager}>
          {loadingManager ? 'Linking...' : 'Link Employees'}
        </button>
      </form>
    </div>
  );
}
