import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const AlumniProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    graduationYear: '', degree: '', branch: '', currentCompany: '',
    currentRole: '', industry: '', skills: '', linkedInURL: '',
    bio: '', location: '', experience: '', willingToRefer: true
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.graduationYear) newErrors.graduationYear = 'Required';
    if (!formData.degree) newErrors.degree = 'Required';
    if (!formData.branch) newErrors.branch = 'Required';
    if (!formData.currentCompany) newErrors.currentCompany = 'Required';
    if (!formData.currentRole) newErrors.currentRole = 'Required';
    if (!formData.industry) newErrors.industry = 'Required';
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
      await API.post('/alumni/profile', {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        graduationYear: parseInt(formData.graduationYear),
        experience: parseInt(formData.experience) || 0
      });
      toast.success('Profile created! Waiting for admin approval.');
      navigate('/alumni/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <div className="card">
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          Setup Alumni Profile
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Complete your profile to start receiving referral requests
        </p>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Graduation Year *</label>
              <input type="number" placeholder="e.g. 2020"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })} />
              {errors.graduationYear && <p className="error-message">{errors.graduationYear}</p>}
            </div>
            <div className="form-group">
              <label>Degree *</label>
              <input type="text" placeholder="e.g. B.Tech"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })} />
              {errors.degree && <p className="error-message">{errors.degree}</p>}
            </div>
            <div className="form-group">
              <label>Branch *</label>
              <input type="text" placeholder="e.g. Computer Science"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
              {errors.branch && <p className="error-message">{errors.branch}</p>}
            </div>
            <div className="form-group">
              <label>Current Company *</label>
              <input type="text" placeholder="e.g. Google"
                value={formData.currentCompany}
                onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })} />
              {errors.currentCompany && <p className="error-message">{errors.currentCompany}</p>}
            </div>
            <div className="form-group">
              <label>Current Role *</label>
              <input type="text" placeholder="e.g. Software Engineer"
                value={formData.currentRole}
                onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })} />
              {errors.currentRole && <p className="error-message">{errors.currentRole}</p>}
            </div>
            <div className="form-group">
              <label>Industry *</label>
              <select value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}>
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Consulting">Consulting</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
              {errors.industry && <p className="error-message">{errors.industry}</p>}
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="number" placeholder="e.g. 3"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" placeholder="e.g. Bangalore, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input type="text" placeholder="e.g. React, Node.js, Python"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input type="url" placeholder="https://linkedin.com/in/..."
              value={formData.linkedInURL}
              onChange={(e) => setFormData({ ...formData, linkedInURL: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea rows="4" placeholder="Tell students about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              style={{ resize: 'vertical' }} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" id="willing" checked={formData.willingToRefer}
              onChange={(e) => setFormData({ ...formData, willingToRefer: e.target.checked })}
              style={{ width: 'auto' }} />
            <label htmlFor="willing" style={{ margin: 0 }}>I am willing to refer students</label>
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlumniProfileSetup;