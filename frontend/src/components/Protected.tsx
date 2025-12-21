import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

type Props = {
  children: React.ReactNode;
  roles?: string[];
};

export const Protected = ({ children, roles }: Props) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (roles && roles.length > 0) {
    const userRoles = user?.userRoles || [];
    const hasRole = roles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

