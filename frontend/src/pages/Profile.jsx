import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCalendar, FaBrain } from 'react-icons/fa';
import { HiPencil, HiCheck } from 'react-icons/hi';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({ name });
      updateUser(res.data.user);
      setEditing(false);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-8"><span className="gradient-text">Profile</span></h1>

          <div className="glass p-8 text-center mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold mb-4">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {editing ? (
              <div className="flex items-center gap-2 justify-center max-w-xs mx-auto">
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-glass text-center" />
                <button onClick={handleSave} disabled={saving} className="p-2.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30">
                  <HiCheck size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <button onClick={() => setEditing(true)} className="text-gray-500 hover:text-primary"><HiPencil /></button>
              </div>
            )}
            <span className={`badge mt-2 ${user?.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>{user?.role}</span>
          </div>

          <div className="glass p-6 space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03]">
              <FaEnvelope className="text-primary" />
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm">{user?.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03]">
              <FaCalendar className="text-accent" />
              <div>
                <div className="text-xs text-gray-500">Joined</div>
                <div className="text-sm">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03]">
              <FaBrain className="text-neon-green" />
              <div>
                <div className="text-xs text-gray-500">Interviews Completed</div>
                <div className="text-sm">{user?.total_interviews || 0}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
