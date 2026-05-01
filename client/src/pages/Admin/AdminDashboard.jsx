import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/admin/stats')
        ]);
        setUsers(usersRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/approve/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
      toast.success('Alumni approved successfully');
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/admin/reject/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, isApproved: false } : u));
      toast.success('Alumni rejected');
    } catch (error) {
      toast.error('Failed to reject');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/user/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredUsers = filter === 'all' ? users :
    filter === 'pending' ? users.filter(u => u.role === 'alumni' && !u.isApproved) :
    users.filter(u => u.role === filter);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Manage users, approvals and monitor platform activity</p>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Users', value: stats.totalUsers, color: '#2563eb' },
          { label: 'Students', value: stats.totalStudents, color: '#7c3aed' },
          { label: 'Alumni', value: stats.totalAlumni, color: '#16a34a' },
          { label: 'Pending Approvals', value: stats.pendingApprovals, color: '#d97706' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Referrals', value: stats.totalReferrals, color: '#2563eb' },
          { label: 'Pending', value: stats.pendingReferrals, color: '#d97706' },
          { label: 'Accepted', value: stats.acceptedReferrals, color: '#16a34a' },
          { label: 'Referred', value: stats.referredReferrals, color: '#7c3aed' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'pending', 'student', 'alumni'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 16px', textTransform: 'capitalize' }}>
            {f === 'pending' ? 'Pending Approval' : f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredUsers.map((user) => (
          <div key={user._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#dbeafe', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: '700', color: '#1e40af'
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontWeight: '600' }}>{user.name}</h4>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>{user.email}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <span className="badge" style={{
                      background: user.role === 'alumni' ? '#dbeafe' : '#f3e8ff',
                      color: user.role === 'alumni' ? '#1e40af' : '#6d28d9'
                    }}>
                      {user.role}
                    </span>
                    {user.role === 'alumni' && (
                      <span className={`badge ${user.isApproved ? 'badge-accepted' : 'badge-pending'}`}>
                        {user.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {user.role === 'alumni' && !user.isApproved && (
                  <button className="btn btn-success" onClick={() => handleApprove(user._id)}
                    style={{ padding: '6px 14px', fontSize: '13px' }}>
                    Approve
                  </button>
                )}
                {user.role === 'alumni' && user.isApproved && (
                  <button className="btn btn-secondary" onClick={() => handleReject(user._id)}
                    style={{ padding: '6px 14px', fontSize: '13px' }}>
                    Revoke
                  </button>
                )}
                <button className="btn btn-danger" onClick={() => handleDelete(user._id)}
                  style={{ padding: '6px 14px', fontSize: '13px' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;