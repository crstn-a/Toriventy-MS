import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Logo, Input } from "../components/AuthForm";
import { authStyles as s } from "../components/AuthStyles";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const setField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', form);

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');

    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Logo />

        <h1 style={s.heading}>Login</h1>

        {error && <p style={s.fieldErr}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={setField('email')}
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={setField('password')}
          />

          <button style={s.primaryBtn} type="submit">
            Login
          </button>
        </form>

        <p style={s.footerText}>
          Don’t have an account?{" "}
          <button style={s.linkBtn} onClick={() => navigate('/signup')}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}