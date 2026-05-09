import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 2l12 12M6.5 6.6A2 2 0 0 0 9.4 9.5M4.2 4.3C2.8 5.3 1.8 6.7 1 8c1.5 2.8 4 5 7 5a7 7 0 0 0 3.8-1.2M6 3.2A7 7 0 0 1 8 3c3 0 5.5 2.2 7 5a10.5 10.5 0 0 1-1.8 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-wrap">⬡</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to manage your products</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'is-error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
            {errors.email && <span className="form-error">⚠ {errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                className={`form-input ${errors.password ? 'is-error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                style={{ paddingRight: '2.75rem' }}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                <EyeIcon open={showPw} />
              </button>
            </div>
            {errors.password && <span className="form-error">⚠ {errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
