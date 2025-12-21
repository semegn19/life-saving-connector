import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../store/auth';

const RegisterPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      setAuth(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <h1>Create Account</h1>
      <form onSubmit={onSubmit} className="card">
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={onChange} />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={onChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">
          Register
        </button>
      </form>
      <p>
        Have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;

