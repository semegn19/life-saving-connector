import { useEffect, useState } from 'react';
import { api } from '../api/client';

type Application = {
  _id: string;
  opportunityId: {
    _id: string;
    title: string;
    organizationId: { name: string };
  };
  status: string;
  appliedAt: string;
  hoursLogged: number;
};

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/volunteers/my-applications');
      setApplications(data.applications || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (id: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.delete(`/volunteers/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to withdraw');
    }
  };

  if (loading) return <div className="page">Loading applications...</div>;
  if (error) return <div className="page error">{error}</div>;

  return (
    <div className="page">
      <h1>My Applications</h1>
      {applications.length === 0 ? (
        <div className="empty-state">No applications yet</div>
      ) : (
        <div className="list">
          {applications.map((app) => (
            <div key={app._id} className="card">
              <div className="card-header">
                <h3>{app.opportunityId?.title || 'Unknown Opportunity'}</h3>
                <span className={`badge badge-${app.status}`}>{app.status}</span>
              </div>
              <p>Organization: {app.opportunityId?.organizationId?.name || 'N/A'}</p>
              <p>Hours logged: {app.hoursLogged || 0}</p>
              <small>Applied: {new Date(app.appliedAt).toLocaleDateString()}</small>
              {app.status === 'pending' && (
                <button onClick={() => withdraw(app._id)} className="btn btn-danger btn-sm">
                  Withdraw
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
