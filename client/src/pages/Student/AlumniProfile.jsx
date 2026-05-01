import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const AlumniProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [messageSending, setMessageSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [formData, setFormData] = useState({
    jobTitle: '', company: '', jobURL: '', message: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get(`/alumni/${id}`);
        setProfile(data);
      } catch (error) {
        toast.error('Profile not found');
        navigate('/alumni');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required';
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.message) newErrors.message = 'Message is required';
    else if (formData.message.length < 50) newErrors.message = 'Message must be at least 50 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    try {
      await API.post('/referrals', { ...formData, alumniId: id });
      toast.success('Referral request sent successfully!');
      setShowForm(false);
      setFormData({ jobTitle: '', company: '', jobURL: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }
    setMessageSending(true);
    try {
      await API.post('/messages', {
        receiverId: id,
        content: messageText
      });
      toast.success('Message sent! Redirecting to inbox...');
      setMessageText('');
      setShowMessageForm(false);
      setTimeout(() => navigate('/messages'), 1500);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setMessageSending(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return null;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: '#dbeafe', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '32px', fontWeight: '700', color: '#1e40af'
          }}>
            {profile.userId?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700' }}>{profile.userId?.name}</h1>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>{profile.currentRole} at {profile.currentCompany}</p>
            {profile.willingToRefer && (
              <span className="badge badge-accepted" style={{ marginTop: '6px', display: 'inline-block' }}>
                Open to Referrals
              </span>
            )}
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '20px' }}>
          <div><strong>🎓 Graduation Year:</strong> {profile.graduationYear}</div>
          <div><strong>📚 Degree:</strong> {profile.degree}</div>
          <div><strong>🏢 Company:</strong> {profile.currentCompany}</div>
          <div><strong>💼 Industry:</strong> {profile.industry}</div>
          <div><strong>📍 Location:</strong> {profile.location || 'Not specified'}</div>
          <div><strong>⏱ Experience:</strong> {profile.experience} years</div>
        </div>

        {profile.bio && (
          <div style={{ marginBottom: '20px' }}>
            <strong>About:</strong>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>{profile.bio}</p>
          </div>
        )}

        {profile.skills?.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Skills:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {profile.skills.map((skill, i) => (
                <span key={i} style={{
                  background: '#eff6ff', color: '#1e40af',
                  padding: '4px 12px', borderRadius: '16px', fontSize: '13px'
                }}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          {profile.linkedInURL && (
            <a href={profile.linkedInURL} target="_blank" rel="noreferrer"
              className="btn btn-outline">
              View LinkedIn
            </a>
          )}

          <button
            className="btn btn-secondary"
            onClick={() => {
              setShowMessageForm(!showMessageForm);
              setShowForm(false);
            }}>
            {showMessageForm ? 'Cancel Message' : '💬 Send Message'}
          </button>

          {profile.willingToRefer && (
            <button className="btn btn-primary"
              onClick={() => {
                setShowForm(!showForm);
                setShowMessageForm(false);
              }}>
              {showForm ? 'Cancel' : '📨 Request Referral'}
            </button>
          )}
        </div>
      </div>

      {showMessageForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>
            💬 Send a Message
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Introduce yourself, ask about their experience, company culture or career advice.
          </p>
          <form onSubmit={handleSendMessage}>
            <div className="form-group">
              <label>Your Message</label>
              <textarea
                rows="5"
                placeholder="Hi! I am a 3rd year CSE student interested in your company. Could you share some insights about the interview process and work culture?..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                style={{ resize: 'vertical' }}
              />
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                {messageText.length}/1000 characters
              </p>
            </div>
            <button type="submit" className="btn btn-secondary" disabled={messageSending}>
              {messageSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      )}

      {showForm && (
        <div className="card">
          <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>
            📨 Send Referral Request
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Fill in the job details and write a compelling message to increase your chances.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Job Title *</label>
                <input type="text" placeholder="e.g. Software Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} />
                {errors.jobTitle && <p className="error-message">{errors.jobTitle}</p>}
              </div>
              <div className="form-group">
                <label>Company *</label>
                <input type="text" placeholder="e.g. Google"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                {errors.company && <p className="error-message">{errors.company}</p>}
              </div>
            </div>
            <div className="form-group">
              <label>Job URL (optional)</label>
              <input type="url" placeholder="https://..."
                value={formData.jobURL}
                onChange={(e) => setFormData({ ...formData, jobURL: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Message to Alumni *</label>
              <textarea rows="5"
                placeholder="Introduce yourself, explain why you are a good fit, what you are looking for... (min 50 characters)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ resize: 'vertical' }}
              />
              {errors.message && <p className="error-message">{errors.message}</p>}
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                {formData.message.length}/1000 characters
              </p>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Referral Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AlumniProfile;