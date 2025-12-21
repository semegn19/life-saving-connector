import { useEffect, useState } from 'react';
import { api } from '../api/client';

type OrganDonor = {
  _id: string;
  organs: string[];
  registrationStatus: string;
  adminApprovedAt?: string;
  rejectionReason?: string;
};

const OrganStatusPage = () => {
  const [donor, setDonor] = useState<OrganDonor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({ organs: [] as string[] });

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/organ/status');
      setDonor(data.donor);
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        setError(err?.response?.data?.message || 'Failed to load status');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleOrgan = (organ: string) => {
    setForm((prev) => ({
      organs: prev.organs.includes(organ) ? prev.organs.filter((o) => o !== organ) : [...prev.organs, organ],
    }));
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.organs.length === 0) {
      alert('Please select at least one organ');
      return;
    }
    try {
      setRegistering(true);
      await api.post('/organ/register', form);
      loadStatus();
      alert('Registration submitted successfully');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page error">{error}</div>;

  const organs = ['Heart', 'Liver', 'Kidneys', 'Lungs', 'Pancreas', 'Corneas'];

  return (
    <div className="page">
      <h1>Organ Donation Status</h1>
      {donor ? (
        <div className="card">
          <h2>Status: {donor.registrationStatus}</h2>
          <p>Registered organs: {donor.organs.join(', ')}</p>
          {donor.adminApprovedAt && <p>Approved: {new Date(donor.adminApprovedAt).toLocaleDateString()}</p>}
          {donor.rejectionReason && <p className="error">Rejection reason: {donor.rejectionReason}</p>}
        </div>
      ) : (
        <div className="card">
          <h2>Register as Organ Donor</h2>
          <form onSubmit={register}>
            <div>
              <p>Select organs you wish to donate:</p>
              {organs.map((organ) => (
                <label key={organ} style={{ display: 'block', margin: '8px 0' }}>
                  <input
                    type="checkbox"
                    checked={form.organs.includes(organ)}
                    onChange={() => toggleOrgan(organ)}
                  />
                  {organ}
                </label>
              ))}
            </div>
            <button type="submit" className="btn" disabled={registering || form.organs.length === 0}>
              {registering ? 'Submitting...' : 'Register'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrganStatusPage;
