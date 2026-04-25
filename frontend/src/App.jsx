import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
<<<<<<< HEAD
=======
import DashboardPage from './pages/DashboardPage';
>>>>>>> fb0ed7e (Added the backend file)

export default function App() {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
=======
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
>>>>>>> fb0ed7e (Added the backend file)
    </Routes>
  );
}