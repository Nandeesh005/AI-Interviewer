import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { motion } from 'framer-motion';
import { FaUsers, FaBrain, FaQuestionCircle, FaTrash, FaPlus, FaChartBar } from 'react-icons/fa';
import { HiSearch } from 'react-icons/hi';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="glass p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddQ, setShowAddQ] = useState(false);
  const [newQ, setNewQ] = useState({ question_text: '', category: 'HR', role: 'Software Engineer', difficulty: 'Medium' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [s, u, i, q] = await Promise.all([
        adminAPI.getStats(), adminAPI.getUsers(), adminAPI.getInterviews(), adminAPI.getQuestions()
      ]);
      setStats(s.data); setUsers(u.data.users); setInterviews(i.data.interviews); setQuestions(q.data.questions);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await adminAPI.deleteUser(id); setUsers(users.filter(u => u.id !== id)); } catch {}
  };

  const handleAddQuestion = async () => {
    if (!newQ.question_text.trim()) return;
    try {
      const res = await adminAPI.addQuestion(newQ);
      setQuestions([...questions, res.data.question]);
      setNewQ({ question_text: '', category: 'HR', role: 'Software Engineer', difficulty: 'Medium' });
      setShowAddQ(false);
    } catch {}
  };

  const handleDeleteQuestion = async (id) => {
    try { await adminAPI.deleteQuestion(id); setQuestions(questions.filter(q => q.id !== id)); } catch {}
  };

  const tabs = [
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'interviews', label: 'Interviews', icon: <FaBrain /> },
    { id: 'questions', label: 'Questions', icon: <FaQuestionCircle /> },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2"><span className="gradient-text">Admin Panel</span></h1>
          <p className="text-gray-400 mb-8">Manage users, interviews, and questions</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<FaUsers className="text-white" />} label="Total Users" value={stats.total_users || 0} color="from-primary to-indigo-500" />
          <StatCard icon={<FaBrain className="text-white" />} label="Total Interviews" value={stats.total_interviews || 0} color="from-cyan-500 to-blue-500" />
          <StatCard icon={<FaQuestionCircle className="text-white" />} label="Questions Bank" value={stats.total_questions || 0} color="from-green-500 to-emerald-500" />
          <StatCard icon={<FaChartBar className="text-white" />} label="Avg Score" value={`${stats.avg_score || 0}%`} color="from-orange-500 to-amber-500" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                ${tab === t.id ? 'bg-primary text-white' : 'glass text-gray-400 hover:text-white'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="input-glass !pl-11" placeholder="Search..." />
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="glass overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                <th className="text-left p-4 text-gray-400 font-medium">Interviews</th>
                <th className="text-left p-4 text-gray-400 font-medium">Joined</th>
                <th className="p-4"></th>
              </tr></thead>
              <tbody>
                {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(u => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 text-gray-400">{u.email}</td>
                    <td className="p-4"><span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>{u.role}</span></td>
                    <td className="p-4">{u.total_interviews}</td>
                    <td className="p-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u.id)} className="text-gray-500 hover:text-red-400"><FaTrash /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Interviews Tab */}
        {tab === 'interviews' && (
          <div className="glass overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">User</th>
                <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                <th className="text-left p-4 text-gray-400 font-medium">Score</th>
                <th className="text-left p-4 text-gray-400 font-medium">Date</th>
              </tr></thead>
              <tbody>
                {interviews.filter(i => (i.user_name || '').toLowerCase().includes(search.toLowerCase())).map(i => (
                  <tr key={i.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="p-4 font-medium">{i.user_name}</td>
                    <td className="p-4">{i.role}</td>
                    <td className="p-4"><span className="badge badge-primary">{i.interview_type}</span></td>
                    <td className="p-4">
                      <span className={`font-bold ${i.overall_score >= 70 ? 'text-green-400' : i.overall_score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {i.overall_score}%
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(i.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Questions Tab */}
        {tab === 'questions' && (
          <>
            <button onClick={() => setShowAddQ(!showAddQ)} className="btn-gradient mb-4 flex items-center gap-2 text-sm">
              <FaPlus /> Add Question
            </button>

            {showAddQ && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 mb-6">
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <select value={newQ.category} onChange={e => setNewQ({ ...newQ, category: e.target.value })} className="input-glass">
                    <option value="HR">HR</option><option value="Technical">Technical</option><option value="Aptitude">Aptitude</option>
                  </select>
                  <select value={newQ.role} onChange={e => setNewQ({ ...newQ, role: e.target.value })} className="input-glass">
                    <option>Software Engineer</option><option>Data Analyst</option><option>AIML Engineer</option><option>Web Developer</option>
                  </select>
                  <select value={newQ.difficulty} onChange={e => setNewQ({ ...newQ, difficulty: e.target.value })} className="input-glass">
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <textarea value={newQ.question_text} onChange={e => setNewQ({ ...newQ, question_text: e.target.value })}
                  className="input-glass w-full h-20 resize-none mb-4" placeholder="Enter question text..." />
                <button onClick={handleAddQuestion} className="btn-gradient text-sm">Save Question</button>
              </motion.div>
            )}

            <div className="space-y-2">
              {questions.filter(q => q.question_text.toLowerCase().includes(search.toLowerCase())).map(q => (
                <div key={q.id} className="glass p-4 flex items-start justify-between gap-4 hover:bg-white/[0.06] transition-all">
                  <div>
                    <div className="flex gap-2 mb-1">
                      <span className="badge badge-primary text-xs">{q.category}</span>
                      <span className="badge badge-info text-xs">{q.role}</span>
                      <span className="badge badge-warning text-xs">{q.difficulty}</span>
                    </div>
                    <p className="text-sm">{q.question_text}</p>
                  </div>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="text-gray-500 hover:text-red-400 shrink-0"><FaTrash /></button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
