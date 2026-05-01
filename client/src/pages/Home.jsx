import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>
            Alumni Referral Network
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '32px', opacity: 0.9 }}>
            Connect students with alumni for meaningful career opportunities and referrals
          </p>
          {!user ? (
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/register" className="btn" style={{
                background: 'white', color: '#1e40af', padding: '14px 32px', fontSize: '16px'
              }}>
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline" style={{
                borderColor: 'white', color: 'white', padding: '14px 32px', fontSize: '16px'
              }}>
                Login
              </Link>
            </div>
          ) : (
            <Link to={
              user.role === 'student' ? '/alumni' :
              user.role === 'alumni' ? '/alumni/dashboard' : '/admin/dashboard'
            } className="btn" style={{
              background: 'white', color: '#1e40af', padding: '14px 32px', fontSize: '16px'
            }}>
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>
          Why Alumni Referral Network?
        </h2>
        <div className="grid-3">
          {[
            { icon: '🔍', title: 'Find Alumni', desc: 'Search alumni by industry, company, role and connect with the right people.' },
            { icon: '🤝', title: 'Request Referrals', desc: 'Send structured referral requests to alumni working at your target companies.' },
            { icon: '📊', title: 'Track Progress', desc: 'Monitor your referral requests from pending to referred in real-time.' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: '#6b7280' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#eff6ff', padding: '60px 20px' }}>
        <div className="container">
          <div className="grid-4">
            {[
              { number: '500+', label: 'Alumni' },
              { number: '1000+', label: 'Students' },
              { number: '300+', label: 'Referrals Given' },
              { number: '50+', label: 'Companies' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', fontWeight: '800', color: '#2563eb' }}>{stat.number}</div>
                <div style={{ color: '#6b7280', fontSize: '16px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;