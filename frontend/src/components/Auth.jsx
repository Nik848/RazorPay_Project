import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';
import { motion } from 'framer-motion';
import { UserCircle, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Frontend Validation
    if (!formData.email.endsWith('@org.com')) {
      setError('Only @org.com email addresses are allowed.');
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        const res = await loginUser(formData.email, formData.password);
        onLogin(res.data.user);
      } else {
        await registerUser(formData.name, formData.email, formData.password);
        setIsLogin(true);
        setError('');
        alert('Registration successful! Please login.');
        setFormData({ name: '', email: formData.email, password: '' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
      <motion.div 
        className="card" 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ padding: '3rem', width: '100%', maxWidth: '420px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '1rem', 
            borderRadius: '1rem', 
            background: 'rgba(177, 178, 255, 0.1)', 
            marginBottom: '1.25rem' 
          }}>
            <UserCircle size={40} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            {isLogin ? 'Enter your details to access your dashboard' : 'Sign up to manage your reimbursements'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ 
              background: 'rgba(255, 182, 185, 0.2)', 
              color: 'var(--danger-text)', 
              padding: '0.85rem', 
              borderRadius: '0.75rem', 
              marginBottom: '1.5rem', 
              fontSize: '0.9rem', 
              textAlign: 'center', 
              border: '1px solid rgba(255,182,185,0.4)',
              fontWeight: '500'
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ paddingLeft: '3rem' }} required={!isLogin} placeholder="John Doe" />
              </div>
            </div>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ paddingLeft: '3rem' }} required placeholder="you@org.com" />
            </div>
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                style={{ paddingLeft: '3rem', paddingRight: '3rem' }} 
                required 
                placeholder="••••••••" 
                minLength={8}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '0.5rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '0.5rem'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '1rem', height: '3rem' }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({name: '', email: '', password: ''}) }} 
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
            >
              {isLogin ? 'Register' : 'Login'}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
