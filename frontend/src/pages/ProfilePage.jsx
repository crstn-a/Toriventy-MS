import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;

    api.get('/users/profile')
      .then((res) => {
        if (!mounted) return;
        setProfile({
          username: res.data?.fld_username ?? res.data?.username ?? '',
          email: res.data?.fld_email ?? res.data?.email ?? '',
        });
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Unable to load profile');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/users/profile', profile);
      setSuccess('Profile updated successfully.');
      // keep local user info in sync if needed
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.username = profile.username;
        parsed.email = profile.email;
        localStorage.setItem('user', JSON.stringify(parsed));
      }
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h1>Profile</h1>
      <form onSubmit={handleSave}>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Name
          <input
            type="text"
            value={profile.username}
            onChange={handleChange('username')}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Email
          <input
            type="email"
            value={profile.email}
            onChange={handleChange('email')}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <button type="submit" disabled={saving} style={{ padding: '10px 16px' }}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      {success && <p style={{ color: 'green', marginTop: 12 }}>{success}</p>}
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
    </div>
  );
}
