import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          🎓 Alumni Referral Network
        </Link>
        <div className="navbar-links">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          ) : (
            <>
              {user.role === 'student' && (
                <>
                  <Link to="/alumni" className="nav-link">Find Alumni</Link>
                  <Link to="/student/dashboard" className="nav-link">My Referrals</Link>
                  <Link to="/messages" className="nav-link">Messages</Link>
                </>
              )}
              {user.role === 'alumni' && (
                <>
                  <Link to="/alumni/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/alumni/requests" className="nav-link">Requests</Link>
                  <Link to="/messages" className="nav-link">Messages</Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="nav-link">Admin</Link>
                </>
              )}
              <span className="nav-username">Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;