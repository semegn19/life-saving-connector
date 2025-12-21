import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/volunteers/opportunities', label: 'Opportunities' },
  { to: '/volunteers/applications', label: 'Applications' },
  { to: '/blood/centers', label: 'Blood Centers' },
  { to: '/organ/status', label: 'Organ Status' },
  { to: '/admin/users', label: 'Admin' },
  { to: '/notifications', label: 'Notifications' },
];

const MainLayout = () => {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Life-Saving Connector</h2>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-block">
            <strong>{user?.firstName || 'User'}</strong>
          </div>
          <button onClick={logout} className="btn">
            Logout
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

