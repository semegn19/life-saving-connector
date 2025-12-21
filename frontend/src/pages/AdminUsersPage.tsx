import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Protected } from '../components/Protected';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isBlocked: boolean;
  isVerified: boolean;
  userRoles: string[];
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/users?page=${page}&limit=20&search=${search}`);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id: string, isBlocked: boolean) => {
    try {
      await api.put(`/admin/users/${id}/${isBlocked ? 'unblock' : 'block'}`);
      loadUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/admin/users/${id}/${isActive ? 'deactivate' : 'activate'}`);
      loadUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update');
    }
  };

  if (loading) return <div className="page">Loading users...</div>;
  if (error) return <div className="page error">{error}</div>;

  return (
    <Protected roles={['platform-admin']}>
      <div className="page">
        <h1>Admin: Users</h1>
        <div className="card">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        </div>
        {users.length === 0 ? (
          <div className="empty-state">No users found</div>
        ) : (
          <>
            <div className="list">
              {users.map((user) => (
                <div key={user._id} className="card">
                  <div className="card-header">
                    <h3>
                      {user.firstName} {user.lastName}
                    </h3>
                    <div>
                      {user.isBlocked && <span className="badge badge-danger">Blocked</span>}
                      {!user.isActive && <span className="badge badge-warning">Inactive</span>}
                      {user.isVerified && <span className="badge badge-success">Verified</span>}
                    </div>
                  </div>
                  <p>{user.email}</p>
                  <p>Roles: {user.userRoles.join(', ') || 'None'}</p>
                  <div className="card-actions">
                    <button
                      onClick={() => toggleBlock(user._id, user.isBlocked)}
                      className={`btn btn-sm ${user.isBlocked ? 'btn-success' : 'btn-danger'}`}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => toggleActive(user._id, user.isActive)}
                      className={`btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {total > 20 && (
              <div style={{ marginTop: '16px' }}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn">
                  Previous
                </button>
                <span style={{ margin: '0 16px' }}>
                  Page {page} of {Math.ceil(total / 20)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / 20)}
                  className="btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Protected>
  );
};

export default AdminUsersPage;
