import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ industry: '', willingToRefer: '' });

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await API.get(`/alumni?${query}`);
      setAlumni(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAlumni({ search, ...filters });
  };

  const handleReset = () => {
    setSearch('');
    setFilters({ industry: '', willingToRefer: '' });
    fetchAlumni();
  };

  if (loading) return <div className="loading">Loading alumni...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Alumni Directory</h1>
      <p className="page-subtitle">Find and connect with alumni in your target industry</p>

      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by company, role, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', minWidth: '200px' }}
            />
            <select
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              <option value="">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Consulting">Consulting</option>
            </select>
            <select
              value={filters.willingToRefer}
              onChange={(e) => setFilters({ ...filters, willingToRefer: e.target.value })}
              style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              <option value="">All Alumni</option>
              <option value="true">Open to Refer</option>
            </select>
            <button type="submit" className="btn btn-primary">Search</button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>

      {alumni.length === 0 ? (
        <div className="empty-state">
          <h3>No alumni found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid-3">
          {alumni.map((profile) => (
            <div key={profile._id} className="card" style={{ position: 'relative' }}>
              {profile.willingToRefer && (
                <span className="badge badge-accepted" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  Open to Refer
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: '#dbeafe', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#1e40af'
                }}>
                  {profile.userId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{profile.userId?.name}</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>{profile.currentRole}</p>
                </div>
              </div>
              <p style={{ color: '#374151', marginBottom: '4px' }}>
                🏢 {profile.currentCompany}
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                🎓 Class of {profile.graduationYear}
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
                📍 {profile.industry}
              </p>
              {profile.skills?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {profile.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} style={{
                      background: '#eff6ff', color: '#1e40af',
                      padding: '2px 8px', borderRadius: '12px', fontSize: '12px'
                    }}>{skill}</span>
                  ))}
                </div>
              )}
              <Link to={`/alumni/${profile.userId?._id}`} className="btn btn-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;