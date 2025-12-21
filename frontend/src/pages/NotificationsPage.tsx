import { useEffect, useState } from 'react';
import { api } from '../api/client';

type Notification = {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      setUnreadCount(data.count || 0);
    } catch (err) {
      // Ignore errors for unread count
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      // Ignore errors
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      // Ignore errors
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      // Ignore errors
    }
  };

  if (loading) return <div className="page">Loading notifications...</div>;
  if (error) return <div className="page error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-secondary">
            Mark all read ({unreadCount})
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="empty-state">No notifications</div>
      ) : (
        <div className="list">
          {notifications.map((notif) => (
            <div key={notif._id} className={`card ${!notif.read ? 'unread' : ''}`}>
              <div className="card-header">
                <h3>{notif.title}</h3>
                <div className="card-actions">
                  {!notif.read && (
                    <button onClick={() => markRead(notif._id)} className="btn btn-sm">
                      Mark read
                    </button>
                  )}
                  <button onClick={() => deleteNotification(notif._id)} className="btn btn-sm btn-danger">
                    Delete
                  </button>
                </div>
              </div>
              <p>{notif.message}</p>
              <small>{new Date(notif.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
