import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuthStore } from '../store/auth';

type DashboardData = {
  volunteer?: { volunteeredHours?: number };
  blood?: { bloodType?: string; totalDonations?: number };
  organ?: { registrationStatus?: string };
};

const DashboardPage = () => {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/users/${user.id}/dashboard`);
        setData(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      {loading && <div className="page">Loading...</div>}
      {error && <div className="page error">{error}</div>}
      {!loading && !error && (
        <div className="list">
          <div className="card">
            <h3>Volunteer Profile</h3>
            <p>Hours volunteered: <strong>{data?.volunteer?.volunteeredHours ?? 0}</strong></p>
            {!data?.volunteer && <p className="text-muted">Not registered as volunteer</p>}
          </div>
          <div className="card">
            <h3>Blood Donor Profile</h3>
            <p>Blood type: <strong>{data?.blood?.bloodType ?? 'N/A'}</strong></p>
            <p>Total donations: <strong>{data?.blood?.totalDonations ?? 0}</strong></p>
            {!data?.blood && <p className="text-muted">Not registered as blood donor</p>}
          </div>
          <div className="card">
            <h3>Organ Donor Profile</h3>
            <p>Status: <strong>{data?.organ?.registrationStatus ?? 'Not registered'}</strong></p>
            {data?.organ?.organs && <p>Organs: {data.organ.organs.join(', ')}</p>}
            {!data?.organ && <p className="text-muted">Not registered as organ donor</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

