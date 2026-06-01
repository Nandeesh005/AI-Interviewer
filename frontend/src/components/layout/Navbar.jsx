import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiUser, HiLogout, HiChartBar, HiDocumentText, HiCog, HiHome } from 'react-icons/hi';
import { FaBrain } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: <HiChartBar /> },
        { to: '/interview', label: 'Interview', icon: <FaBrain /> },
        { to: '/resume', label: 'Resume', icon: <HiDocumentText /> },
        { to: '/profile', label: 'Profile', icon: <HiUser /> },
        ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: <HiCog /> }] : []),
      ]
    : [];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center
                            group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
              <FaBrain className="text-white text-lg" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">InterviewIQ AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${isActive(link.to)
                    ? 'bg-primary/20 text-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">{user.name}</span>
                </div>
                <button onClick={handleLogout}
                  className="hidden md:flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors">
                  <HiLogout /> Logout
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm !py-2 !px-5">Login</Link>
                <Link to="/register" className="btn-gradient text-sm !py-2 !px-5">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white">
              {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive(link.to) ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
              {user ? (
                <button onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
                  <HiLogout /> Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm text-gray-300 hover:text-white">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm text-primary">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
