import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuthStore } from '../store/auth';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', bio: '' });

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users/${user?.id}`);
      setProfile(data.user);
      setForm({
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        phone: data.user.phone || '',
        bio: data.user.bio || '',
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put(`/users/${user?.id}`, form);
      loadProfile();
      alert('Profile updated');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page">Loading profile...</div>;
  if (error) return <div className="page error">{error}</div>;

  return (
    <div className="page">
      <h1>Profile</h1>
      <div className="card">
        <form onSubmit={save}>
          <div>
            <label>First Name</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Last Name</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          </div>
          <div>
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label>Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} />
          </div>
          <div>
            <label>Email</label>
            <input value={profile?.email || ''} disabled />
          </div>
          <div>
            <label>Roles</label>
            <input value={(profile?.userRoles || []).join(', ') || 'None'} disabled />
          </div>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
