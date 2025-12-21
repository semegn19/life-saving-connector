import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Protected } from '../components/Protected';

type Organization = {
  _id: string;
  name: string;
  type: string;
  verificationStatus: string;
  email: string;
};

const AdminOrgsPage = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadOrgs();
  }, [page, search]);

  const loadOrgs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/organizations?page=${page}&limit=20&search=${search}`);
      setOrgs(data.organizations || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const verify = async (id: string) => {
    try {
      await api.post(`/admin/organizations/${id}/verify`);
      loadOrgs();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to verify');
    }
  };

  const reject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this organization?')) return;
    try {
      await api.post(`/admin/organizations/${id}/reject`);
      loadOrgs();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to reject');
    }
  };

  if (loading) return <div className="page">Loading organizations...</div>;
  if (error) return <div className="page error">{error}</div>;

  return (
    <Protected roles={['platform-admin']}>
      <div className="page">
        <h1>Admin: Organizations</h1>
        <div className="card">
          <input
            type="text"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        </div>
        {orgs.length === 0 ? (
          <div className="empty-state">No organizations found</div>
        ) : (
          <div className="list">
            {orgs.map((org) => (
              <div key={org._id} className="card">
                <div className="card-header">
                  <h3>{org.name}</h3>
                  <span className={`badge badge-${org.verificationStatus}`}>{org.verificationStatus}</span>
                </div>
                <p>Type: {org.type}</p>
                <p>Email: {org.email}</p>
                <div className="card-actions">
                  {org.verificationStatus === 'pending' && (
                    <>
                      <button onClick={() => verify(org._id)} className="btn btn-sm btn-success">
                        Verify
                      </button>
                      <button onClick={() => reject(org._id)} className="btn btn-sm btn-danger">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Protected>
  );
};

export default AdminOrgsPage;
