import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaBrain } from 'react-icons/fa';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass p-8 neon-glow">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
              <FaBrain className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">Start your interview preparation journey</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="input-glass !pl-11" placeholder="John Doe" required />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-glass !pl-11" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass !pl-11 !pr-11" placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-gradient w-full !py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-light font-medium">Sign In</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
