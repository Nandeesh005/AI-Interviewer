import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Report from './pages/Report';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl text-gray-400">Loading...</div></div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh">
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/interview" element={<PrivateRoute><Interview /></PrivateRoute>} />
        <Route path="/resume" element={<PrivateRoute><ResumeAnalyzer /></PrivateRoute>} />
        <Route path="/report/:id" element={<PrivateRoute><Report /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
    </div>
  );
}
