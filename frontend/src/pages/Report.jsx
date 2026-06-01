import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FaBrain, FaDownload, FaArrowLeft, FaStar, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';
import { HiCheckCircle, HiTrendingUp } from 'react-icons/hi';

const COLORS = ['#6c63ff', '#00d4ff', '#00ff88', '#ffaa00', '#ff6b9d'];

function ScoreRing({ score, size = 120, label, color = '#6c63ff' }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-2xl font-bold">{score}%</span>
      </div>
      {label && <span className="text-xs text-gray-400 mt-2">{label}</span>}
    </div>
  );
}

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      const res = await interviewAPI.getById(id);
      setInterview(res.data.interview);
    } catch { navigate('/dashboard'); }
    setLoading(false);
  };

  const downloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin: 0.5, filename: `InterviewIQ_Report_${id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#0a0a1a' },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(reportRef.current).save();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!interview) return null;

  const fb = interview.feedback || {};
  const scores = [
    { name: 'Overall', value: interview.overall_score, color: '#6c63ff' },
    { name: 'Technical', value: interview.technical_score, color: '#00d4ff' },
    { name: 'Communication', value: interview.communication_score, color: '#00ff88' },
    { name: 'Confidence', value: interview.confidence_score, color: '#ffaa00' },
    { name: 'Eye Contact', value: interview.eye_contact_score, color: '#ff6b9d' },
  ];

  const barData = scores.map(s => ({ name: s.name, score: s.value }));

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2">
              <FaArrowLeft /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold"><span className="gradient-text">Interview Report</span></h1>
            <p className="text-gray-400 text-sm mt-1">{interview.role} • {interview.interview_type} • {new Date(interview.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={downloadPDF} className="btn-gradient flex items-center gap-2">
            <FaDownload /> Download PDF
          </button>
        </div>

        <div ref={reportRef}>
          {/* Overall Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass p-8 mb-6 text-center">
            <h2 className="text-lg font-semibold mb-6 text-gray-300">Overall Performance</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {scores.map(s => (
                <div key={s.name} className="relative">
                  <ScoreRing score={Math.round(s.value)} label={s.name} color={s.color} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Score Bars */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><HiTrendingUp className="text-primary" /> Score Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} stroke="#666" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#666" fontSize={12} width={110} />
                <Tooltip contentStyle={{ background: '#1a1a44', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={20}>
                  {barData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="glass p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-green-400">
                <HiCheckCircle /> Strengths
              </h3>
              <ul className="space-y-3">
                {(fb.strengths || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <FaStar className="text-neon-orange mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Weaknesses */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="glass p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-yellow-400">
                <FaExclamationTriangle /> Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {(fb.weaknesses || []).map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="text-yellow-400 mt-0.5 shrink-0">⚠</span>
                    {w}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* AI Suggestions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-accent">
              <FaLightbulb /> AI Suggestions
            </h3>
            <div className="space-y-3">
              {(fb.suggestions || []).map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] text-sm text-gray-300">
                  <span className="text-accent font-bold">{i + 1}.</span>
                  {s}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="glass p-6 mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><FaBrain className="text-primary" /> AI Summary</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{fb.summary || 'No summary available.'}</p>
            {fb.emotion_summary && (
              <p className="text-sm text-gray-400 mt-3 italic">{fb.emotion_summary}</p>
            )}
          </motion.div>

          {/* Q&A Review */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass p-6">
            <h3 className="font-semibold mb-4">Questions & Answers</h3>
            <div className="space-y-4">
              {(interview.questions || []).map((qa, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary text-xs">Q{i + 1}</span>
                    <span className="badge badge-info text-xs">{qa.category}</span>
                  </div>
                  <p className="text-sm font-medium mb-2">{qa.question}</p>
                  <p className="text-sm text-gray-400">{qa.answer || <span className="italic text-gray-600">No answer provided</span>}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
