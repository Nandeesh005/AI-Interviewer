import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBrain, FaVideo, FaMicrophone, FaChartLine, FaFileAlt, FaRobot, FaStar } from 'react-icons/fa';
import { HiLightningBolt, HiArrowRight } from 'react-icons/hi';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }) };

const features = [
  { icon: <FaBrain />, title: 'AI-Powered Questions', desc: 'Smart role-based interview questions generated for your target position', color: 'from-purple-500 to-indigo-500' },
  { icon: <FaVideo />, title: 'Emotion Detection', desc: 'Real-time facial emotion analysis using AI-powered webcam tracking', color: 'from-cyan-500 to-blue-500' },
  { icon: <FaMicrophone />, title: 'Voice Analysis', desc: 'Speech fluency scoring with filler word detection and pace analysis', color: 'from-pink-500 to-rose-500' },
  { icon: <FaChartLine />, title: 'Performance Analytics', desc: 'Comprehensive dashboards with scores, trends, and AI insights', color: 'from-green-500 to-emerald-500' },
  { icon: <FaFileAlt />, title: 'Resume Analyzer', desc: 'Upload your resume for personalized interview preparation', color: 'from-orange-500 to-amber-500' },
  { icon: <FaRobot />, title: 'AI Feedback', desc: 'Detailed post-interview reports with strengths and improvement tips', color: 'from-violet-500 to-purple-500' },
];

const steps = [
  { num: '01', title: 'Select Your Role', desc: 'Choose from Software Engineer, Data Analyst, AIML Engineer, or Web Developer' },
  { num: '02', title: 'Take the Interview', desc: 'Answer AI-generated questions with webcam and microphone enabled' },
  { num: '03', title: 'Get AI Analysis', desc: 'Receive detailed feedback on your performance with actionable insights' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer at Google', text: 'InterviewIQ helped me prepare for my Google interview. The emotion tracking made me aware of my nervous habits!', rating: 5 },
  { name: 'Rahul Patel', role: 'Data Analyst at Amazon', text: 'The AI feedback was incredibly detailed. It felt like having a personal interview coach available 24/7.', rating: 5 },
  { name: 'Anjali Verma', role: 'ML Engineer at Microsoft', text: 'Resume-based questions were spot on! It identified gaps in my knowledge I didn\'t even know existed.', rating: 5 },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-pink/10 rounded-full blur-3xl animate-float" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-accent">
            <HiLightningBolt className="text-neon-orange" />
            AI-Powered Interview Preparation Platform
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            Master Your Next
            <br />
            <span className="gradient-text">Interview with AI</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice with AI-generated questions, get real-time emotion and voice analysis,
            and receive professional feedback to ace any interview.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-gradient text-lg !px-10 !py-4 flex items-center gap-2 group">
              Start Free Practice
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-outline text-lg !px-10 !py-4">
              Sign In
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible"
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
            {[{ val: '10K+', label: 'Interviews' }, { val: '95%', label: 'Success Rate' }, { val: '4.9★', label: 'Rating' }].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold gradient-text">{s.val}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powered by <span className="gradient-text">Advanced AI</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Everything you need to prepare for your dream job interview
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass p-6 hover:bg-white/[0.08] transition-all duration-500 group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-xl mb-4
                  group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16">
            How It <span className="gradient-text">Works</span>
          </motion.h2>

          <div className="space-y-8">
            {steps.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass p-8 flex items-start gap-6 hover:neon-glow transition-all duration-500"
              >
                <div className="text-4xl font-black gradient-text shrink-0">{s.num}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16">
            What Our Users <span className="gradient-text">Say</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FaStar key={j} className="text-neon-orange text-sm" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto glass p-12 text-center neon-glow">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Ace Your Interview?</h2>
          <p className="text-gray-400 mb-8">Join thousands of successful candidates who prepared with InterviewIQ AI</p>
          <Link to="/register" className="btn-gradient text-lg !px-12 !py-4 inline-flex items-center gap-2">
            Get Started Free <HiArrowRight />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaBrain className="text-primary" />
            <span className="font-semibold gradient-text">InterviewIQ AI</span>
          </div>
          <p className="text-sm text-gray-500">© 2024 InterviewIQ AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
