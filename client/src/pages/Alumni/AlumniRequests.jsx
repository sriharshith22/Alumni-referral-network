import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const AlumniRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [responding, setResponding] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await API.get('/referrals/incoming');
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const { data } = await API.put(`/referrals/${id}/status`, {
        status, alumniResponse: response
      });
      setRequests(requests.map(r => r._id === id ? data : r));
      setResponding(null);
      setResponse('');
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Referral Requests</h1>
      <p className="page-subtitle">Manage incoming referral requests from students</p>

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
          <h3>No requests found</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((req) => (
            <div key={req._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{req.studentId?.name}</h3>
                  <p style={{ color: '#6b7280' }}>Applying for: <strong>{req.jobTitle}</strong> at <strong>{req.company}</strong></p>
                  <p style={{ color: '#9ca3af', fontSize: '13px' }}>{new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`badge badge-${req.status}`}>{req.status}</span>
              </div>

              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                <strong style={{ fontSize: '13px' }}>Student Message:</strong>
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{req.message}</p>
              </div>

              {req.jobURL && (
                <a href={req.jobURL} target="_blank" rel="noreferrer"
                  style={{ color: '#2563eb', fontSize: '14px', display: 'block', marginBottom: '12px' }}>
                  View Job Posting →
                </a>
              )}

              {req.status === 'pending' && (
                <>
                  {responding === req._id ? (
                    <div>
                      <textarea rows="3" placeholder="Add a response message (optional)"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '10px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-success" onClick={() => handleUpdateStatus(req._id, 'accepted')}>
                          Accept
                        </button>
                        <button className="btn btn-danger" onClick={() => handleUpdateStatus(req._id, 'declined')}>
                          Decline
                        </button>
                        <button className="btn btn-secondary" onClick={() => setResponding(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn btn-primary" onClick={() => setResponding(req._id)}>
                      Respond
                    </button>
                  )}
                </>
              )}

              {req.status === 'accepted' && (
                <button className="btn btn-success" onClick={() => handleUpdateStatus(req._id, 'referred')}>
                  Mark as Referred
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlumniRequests;