import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, requestsRes] = await Promise.all([
          API.get(`/alumni/${user._id}`),
          API.get('/referrals/incoming')
        ]);
        setProfile(profileRes.data);
        setRequests(requestsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleRefer = async () => {
    try {
      const { data } = await API.put('/alumni/toggle-refer');
      setProfile({ ...profile, willingToRefer: data.willingToRefer });
      toast.success(`You are now ${data.willingToRefer ? 'open to' : 'not accepting'} referrals`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
  };

  return (
    <div className="container">
      <h1 className="page-title">Alumni Dashboard</h1>
      <p className="page-subtitle">Welcome back, {user.name}!</p>

      {!profile ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Profile not set up yet</h3>
          <p style={{ color: '#6b7280', margin: '12px 0' }}>Complete your profile to start receiving referral requests</p>
          <Link to="/alumni/setup" className="btn btn-primary">Setup Profile</Link>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{profile.currentRole} at {profile.currentCompany}</h3>
                <p style={{ color: '#6b7280' }}>{profile.industry} • {profile.location}</p>
                {!user.isApproved && (
                  <span className="badge badge-pending" style={{ marginTop: '8px', display: 'inline-block' }}>
                    Pending Admin Approval
                  </span>
                )}
              </div>
              <button
                onClick={handleToggleRefer}
                className={`btn ${profile.willingToRefer ? 'btn-success' : 'btn-secondary'}`}>
                {profile.willingToRefer ? 'Open to Referrals ✓' : 'Not Available'}
              </button>
            </div>
          </div>

          <div className="grid-3" style={{ marginBottom: '24px' }}>
            {[
              { label: 'Total Requests', value: stats.total, color: '#2563eb' },
              { label: 'Pending', value: stats.pending, color: '#d97706' },
              { label: 'Accepted', value: stats.accepted, color: '#16a34a' },
            ].map((stat, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                <div style={{ color: '#6b7280' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Recent Requests</h2>
            <Link to="/alumni/requests" className="btn btn-outline">View All</Link>
          </div>

          {requests.slice(0, 3).map((req) => (
            <div key={req._id} className="card" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4>{req.studentId?.name}</h4>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>{req.jobTitle} at {req.company}</p>
                </div>
                <span className={`badge badge-${req.status}`}>{req.status}</span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AlumniDashboard;