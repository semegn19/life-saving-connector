import { useEffect, useState } from 'react';
import { api } from '../api/client';

type Appointment = {
  _id: string;
  date: string;
  status: string;
  centerId?: {
    name?: string;
    address?: string;
    city?: string;
  };
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [centerId, setCenterId] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/blood/appointments');
      setAppointments(data.appointments || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    loadCenters();
  }, []);

  const loadCenters = async () => {
    try {
      const { data } = await api.get('/blood/centers');
      setCenters(data.centers || []);
    } catch (err) {
      // Ignore errors
    }
  };

  const onBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/blood/appointments', { centerId, date });
      setCenterId('');
      setDate('');
      await loadAppointments();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.delete(`/blood/appointments/${id}`);
      loadAppointments();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div className="page">
      <h1>Blood Donation Appointments</h1>
      <form onSubmit={onBook} className="card" style={{ maxWidth: 480, marginBottom: '1.5rem' }}>
        <h3>Book new appointment</h3>
        <select
          value={centerId}
          onChange={(e) => setCenterId(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '8px' }}
        >
          <option value="">Select center</option>
          {centers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} - {c.city}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '8px' }}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>

      {loading && <div className="page">Loading appointments...</div>}
      {!loading && appointments.length === 0 && <div className="empty-state">No appointments yet</div>}
      <div className="list">
        {appointments.map((a) => (
          <div key={a._id} className="card">
            <div className="card-header">
              <h3>{a.centerId?.name || 'Unknown Center'}</h3>
              <span className={`badge badge-${a.status}`}>{a.status}</span>
            </div>
            <p>{a.centerId?.address}</p>
            <p>{a.centerId?.city}</p>
            <p>Date: {new Date(a.date).toLocaleString()}</p>
            {a.status === 'booked' && (
              <button onClick={() => cancel(a._id)} className="btn btn-danger btn-sm">
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsPage;

