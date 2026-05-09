import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-mark">⬡</div>
          <span className="logo-text">Weero<span className="logo-dot">.</span></span>
        </Link>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <div className="user-pill">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`btn btn-ghost btn-sm ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
