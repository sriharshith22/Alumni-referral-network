import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'student'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Password must contain at least one uppercase letter';
    else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Password must contain at least one number';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      login(data);
      toast.success('Registration successful!');
      if (data.role === 'student') navigate('/alumni');
      else navigate('/alumni/setup');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', marginTop: '40px' }}>
      <div className="card">
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
          Create Account
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>
          Join the Alumni Referral Network
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 8 chars, 1 uppercase, 1 number"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#6b7280' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;