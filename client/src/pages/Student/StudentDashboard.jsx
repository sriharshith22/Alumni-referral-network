import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const statusSteps = ['pending', 'accepted', 'referred'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await API.get('/referrals/my-requests');
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    referred: requests.filter(r => r.status === 'referred').length,
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1 className="page-title">My Referral Requests</h1>
      <p className="page-subtitle">Track all your referral requests in one place</p>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Requests', value: stats.total, color: '#2563eb' },
          { label: 'Pending', value: stats.pending, color: '#d97706' },
          { label: 'Accepted', value: stats.accepted, color: '#16a34a' },
          { label: 'Referred', value: stats.referred, color: '#7c3aed' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'pending', 'accepted', 'declined', 'referred'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`btn ${filter === s ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 16px', textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No referral requests yet</h3>
          <p>Browse the alumni directory and send your first request!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((req) => (
            <div key={req._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{req.jobTitle}</h3>
                  <p style={{ color: '#6b7280' }}>🏢 {req.company}</p>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Alumni: {req.alumniId?.name}
                  </p>
                </div>
                <span className={`badge badge-${req.status}`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>

              <div style={{ margin: '16px 0', display: 'flex', gap: '8px' }}>
                {statusSteps.map((step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: statusSteps.indexOf(req.status) >= i ? '#2563eb' : '#e5e7eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '12px'
                    }}>{i + 1}</div>
                    <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>{step}</span>
                    {i < statusSteps.length - 1 && (
                      <div style={{ width: '30px', height: '2px', background: statusSteps.indexOf(req.status) > i ? '#2563eb' : '#e5e7eb' }} />
                    )}
                  </div>
                ))}
              </div>

              {req.alumniResponse && (
                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
                  <strong style={{ fontSize: '13px' }}>Alumni Response:</strong>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{req.alumniResponse}</p>
                </div>
              )}
              <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>
                Sent on {new Date(req.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;