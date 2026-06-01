import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services/api';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaBrain, FaChartLine, FaMicrophone, FaEye, FaPlay, FaFileAlt } from 'react-icons/fa';
import { HiLightningBolt, HiClock, HiTrendingUp } from 'react-icons/hi';

const COLORS = ['#6c63ff', '#00d4ff', '#00ff88', '#ffaa00', '#ff6b9d'];

function StatCard({ icon, label, value, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="glass p-5 hover:bg-white/[0.08] transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center
                        group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <HiTrendingUp className="text-green-400 text-lg" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        interviewAPI.getStats(),
        interviewAPI.getHistory()
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data.interviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const trendData = history.slice(0, 10).reverse().map((item, i) => ({
    name: `#${i + 1}`,
    score: item.overall_score,
    confidence: item.confidence_score,
    communication: item.communication_score,
  }));

  const pieData = stats ? [
    { name: 'Technical', value: stats.avg_technical || 0 },
    { name: 'Communication', value: stats.avg_communication || 0 },
    { name: 'Confidence', value: stats.avg_confidence || 0 },
    { name: 'Eye Contact', value: stats.avg_eye_contact || 0 },
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-gray-400 mt-1">Track your interview preparation progress</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/interview')}
            className="glass p-6 flex items-center gap-4 hover:bg-primary/10 hover:border-primary/30 transition-all group text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center
                          group-hover:scale-110 transition-transform">
              <FaPlay className="text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Start Interview</h3>
              <p className="text-sm text-gray-400">Practice with AI-powered questions</p>
            </div>
          </motion.button>

          <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/resume')}
            className="glass p-6 flex items-center gap-4 hover:bg-accent/10 hover:border-accent/30 transition-all group text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center
                          group-hover:scale-110 transition-transform">
              <FaFileAlt className="text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Analyze Resume</h3>
              <p className="text-sm text-gray-400">Get personalized interview questions</p>
            </div>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={<FaBrain className="text-white" />} label="Total Interviews" value={stats?.total_interviews || 0} color="from-primary to-indigo-500" delay={0.1} />
          <StatCard icon={<FaChartLine className="text-white" />} label="Average Score" value={`${stats?.avg_score || 0}%`} color="from-cyan-500 to-blue-500" delay={0.15} />
          <StatCard icon={<HiLightningBolt className="text-white" />} label="Confidence" value={`${stats?.avg_confidence || 0}%`} color="from-green-500 to-emerald-500" delay={0.2} />
          <StatCard icon={<FaMicrophone className="text-white" />} label="Communication" value={`${stats?.avg_communication || 0}%`} color="from-pink-500 to-rose-500" delay={0.25} />
          <StatCard icon={<FaEye className="text-white" />} label="Eye Contact" value={`${stats?.avg_eye_contact || 0}%`} color="from-orange-500 to-amber-500" delay={0.3} />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <HiTrendingUp className="text-primary" /> Performance Trend
            </h3>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#1a1a44', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                  <Line type="monotone" dataKey="score" stroke="#6c63ff" strokeWidth={3} dot={{ fill: '#6c63ff', r: 5 }} />
                  <Line type="monotone" dataKey="confidence" stroke="#00ff88" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="communication" stroke="#00d4ff" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                Complete your first interview to see trends
              </div>
            )}
          </motion.div>

          {/* Skills Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass p-6">
            <h3 className="font-semibold mb-4">Skills Breakdown</h3>
            {pieData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a44', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">
                No data yet
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-400">{d.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <HiClock className="text-accent" /> Recent Interviews
          </h3>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.slice(0, 5).map((item) => (
                <Link key={item.id} to={`/report/${item.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      <FaBrain className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.role}</div>
                      <div className="text-xs text-gray-500">{item.interview_type} • {new Date(item.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-lg font-bold ${item.overall_score >= 70 ? 'text-green-400' : item.overall_score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {item.overall_score}%
                    </div>
                    <span className="text-gray-600 group-hover:text-primary transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <FaBrain className="text-4xl mx-auto mb-3 opacity-30" />
              <p>No interviews yet. Start your first practice session!</p>
              <button onClick={() => navigate('/interview')} className="btn-gradient mt-4 text-sm !py-2.5">
                Start Interview
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
