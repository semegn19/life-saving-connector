import { create } from 'zustand';

type User = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userRoles?: string[];
};

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

const storedToken = localStorage.getItem('lsc_token');
const storedUser = localStorage.getItem('lsc_user');

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  setAuth: (token, user) => {
    localStorage.setItem('lsc_token', token);
    localStorage.setItem('lsc_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('lsc_token');
    localStorage.removeItem('lsc_user');
    set({ token: null, user: null });
  },
}));

