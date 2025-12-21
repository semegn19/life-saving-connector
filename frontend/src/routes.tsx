import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import ApplicationsPage from './pages/ApplicationsPage';
import HoursPage from './pages/HoursPage';
import BloodCentersPage from './pages/BloodCentersPage';
import AppointmentsPage from './pages/AppointmentsPage';
import OrganStatusPage from './pages/OrganStatusPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminOrgsPage from './pages/AdminOrgsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import { Protected } from './components/Protected';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/volunteers/opportunities', element: <OpportunitiesPage /> },
      { path: '/volunteers/applications', element: <ApplicationsPage /> },
      { path: '/volunteers/hours', element: <HoursPage /> },
      { path: '/blood/centers', element: <BloodCentersPage /> },
      { path: '/blood/appointments', element: <AppointmentsPage /> },
      { path: '/organ/status', element: <OrganStatusPage /> },
      { path: '/admin/users', element: <AdminUsersPage /> },
      { path: '/admin/organizations', element: <AdminOrgsPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
    ],
  },
  { path: '*', element: <div style={{ padding: 24 }}>Not found</div> },
]);

