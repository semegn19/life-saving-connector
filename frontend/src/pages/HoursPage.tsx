import { useEffect, useState } from 'react';
import { api } from '../api/client';

const HoursPage = () => {
  const [hours, setHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logHours, setLogHours] = useState({ hours: '', applicationId: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/volunteers/my-applications');
      const total = data.applications?.reduce((sum: number, app: any) => sum + (app.hoursLogged || 0), 0) || 0;
      setHours(total);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load hours');
    } finally {
      setLoading(false);
    }
  };

  const submitHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logHours.hours || parseFloat(logHours.hours) <= 0) {
      alert('Please enter valid hours');
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/volunteers/hours', {
        hours: parseFloat(logHours.hours),
        applicationId: logHours.applicationId || undefined,
      });
      setLogHours({ hours: '', applicationId: '' });
      loadProfile();
      alert('Hours logged successfully');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to log hours');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page error">{error}</div>;

  return (
    <div className="page">
      <h1>Volunteer Hours</h1>
      <div className="card">
        <h2>Total Hours: {hours}</h2>
      </div>
      <div className="card">
        <h3>Log New Hours</h3>
        <form onSubmit={submitHours}>
          <input
            type="number"
            step="0.5"
            min="0.5"
            placeholder="Hours"
            value={logHours.hours}
            onChange={(e) => setLogHours({ ...logHours, hours: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Application ID (optional)"
            value={logHours.applicationId}
            onChange={(e) => setLogHours({ ...logHours, applicationId: e.target.value })}
          />
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Logging...' : 'Log Hours'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HoursPage;
