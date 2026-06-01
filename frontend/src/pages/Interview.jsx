import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI, feedbackAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPlay, FaStop } from 'react-icons/fa';
import { HiClock, HiArrowRight, HiCheck, HiLightningBolt } from 'react-icons/hi';

const ROLES = [
  { id: 'Software Engineer', icon: '💻', color: 'from-purple-500 to-indigo-500' },
  { id: 'Data Analyst', icon: '📊', color: 'from-cyan-500 to-blue-500' },
  { id: 'AIML Engineer', icon: '🤖', color: 'from-green-500 to-emerald-500' },
  { id: 'Web Developer', icon: '🌐', color: 'from-orange-500 to-amber-500' },
];

const CATEGORIES = ['Mixed', 'HR', 'Technical', 'Aptitude'];

const EMOTIONS = ['😐 Neutral', '😊 Happy', '😰 Nervous', '💪 Confident', '😢 Sad'];
const FILLER_WORDS = ['umm', 'uhh', 'ahh', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of'];

export default function Interview() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup'); // setup | interview | processing
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('Mixed');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [webcamOn, setWebcamOn] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('😐 Neutral');
  const [emotionConfidence, setEmotionConfidence] = useState(85);
  const [emotionLog, setEmotionLog] = useState([]);
  const [eyeContact, setEyeContact] = useState(80);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fillerCount, setFillerCount] = useState(0);
  const [wordsSpoken, setWordsSpoken] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const emotionIntervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Speech Recognition Setup
  const setupSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += t + ' ';
          // Count filler words
          const lower = t.toLowerCase();
          FILLER_WORDS.forEach(fw => {
            const regex = new RegExp(`\\b${fw}\\b`, 'gi');
            const matches = lower.match(regex);
            if (matches) setFillerCount(prev => prev + matches.length);
          });
          setWordsSpoken(prev => prev + t.split(/\s+/).filter(Boolean).length);
        } else {
          interimText += t;
        }
      }
      if (finalText) setTranscript(prev => prev + finalText);
    };

    recognition.onerror = () => {};
    recognitionRef.current = recognition;
  }, []);

  // Webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setWebcamOn(true);
      startEmotionSimulation();
    } catch { setWebcamOn(false); }
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setWebcamOn(false);
    if (emotionIntervalRef.current) clearInterval(emotionIntervalRef.current);
  };

  // Simulate emotion detection (replace with face-api.js for production)
  const startEmotionSimulation = () => {
    emotionIntervalRef.current = setInterval(() => {
      const idx = Math.random() < 0.5 ? 0 : Math.random() < 0.4 ? 3 : Math.random() < 0.5 ? 1 : Math.random() < 0.7 ? 2 : 4;
      const conf = Math.floor(65 + Math.random() * 30);
      setCurrentEmotion(EMOTIONS[idx]);
      setEmotionConfidence(conf);
      setEyeContact(prev => Math.max(40, Math.min(98, prev + (Math.random() > 0.3 ? 1 : -2))));
      setEmotionLog(prev => [...prev, { emotion: EMOTIONS[idx], confidence: conf, time: Date.now() }]);
    }, 3000);
  };

  // TTS - Speak question aloud
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Timer
  useEffect(() => {
    if (phase === 'interview') {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) { handleNextQuestion(); return 120; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [phase, currentQ]);

  // Start Interview
  const handleStart = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const res = await interviewAPI.getQuestions(role, category);
      const qs = res.data.questions;
      if (!qs.length) { setLoading(false); return; }
      setQuestions(qs);
      setAnswers(new Array(qs.length).fill(''));
      setPhase('interview');
      startTimeRef.current = Date.now();
      setupSpeechRecognition();
      await startWebcam();
      setTimeout(() => speakQuestion(qs[0].question_text), 500);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // Toggle Mic
  const toggleRecording = () => {
    if (!recognitionRef.current) { setupSpeechRecognition(); }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); }

    const newAnswers = [...answers];
    newAnswers[currentQ] = transcript || answers[currentQ];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setTranscript('');
      setTimer(120);
      setTimeout(() => speakQuestion(questions[currentQ + 1].question_text), 500);
    } else {
      handleFinish(newAnswers);
    }
  };

  // Finish Interview
  const handleFinish = async (finalAnswers = answers) => {
    setPhase('processing');
    clearInterval(timerRef.current);
    stopWebcam();
    window.speechSynthesis?.cancel();

    const duration = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
    const qaData = questions.map((q, i) => ({ question: q.question_text, answer: finalAnswers[i] || '', category: q.category }));

    const emotionSummary = {};
    emotionLog.forEach(e => { emotionSummary[e.emotion] = (emotionSummary[e.emotion] || 0) + 1; });

    const voiceData = { filler_count: fillerCount, words_spoken: wordsSpoken, wpm: Math.round(wordsSpoken / Math.max(duration / 60, 1)) };

    try {
      const fbRes = await feedbackAPI.generate({
        questions: qaData, emotion_data: emotionSummary, voice_data: voiceData,
        eye_contact_score: eyeContact, role
      });
      const feedback = fbRes.data.feedback;

      const saveRes = await interviewAPI.save({
        role, interview_type: category, questions: qaData,
        overall_score: feedback.overall_score, technical_score: feedback.technical_score,
        communication_score: feedback.communication_score, confidence_score: feedback.confidence_score,
        emotion_data: emotionSummary, voice_data: voiceData,
        eye_contact_score: eyeContact, feedback, duration
      });

      navigate(`/report/${saveRes.data.interview.id}`);
    } catch {
      navigate('/dashboard');
    }
  };

  // Cleanup
  useEffect(() => {
    return () => { stopWebcam(); clearInterval(timerRef.current); window.speechSynthesis?.cancel(); };
  }, []);

  // SETUP PHASE
  if (phase === 'setup') {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Start <span className="gradient-text">AI Interview</span></h1>
            <p className="text-gray-400 mb-8">Choose your role and question category</p>

            <h3 className="font-semibold mb-4 text-gray-300">Select Role</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {ROLES.map(r => (
                <button key={r.id} onClick={() => setRole(r.id)}
                  className={`glass p-5 text-left transition-all duration-300 hover:scale-[1.02]
                    ${role === r.id ? 'border-primary/50 bg-primary/10 neon-glow' : 'hover:bg-white/[0.06]'}`}>
                  <div className="text-3xl mb-2">{r.icon}</div>
                  <div className="font-semibold">{r.id}</div>
                </button>
              ))}
            </div>

            <h3 className="font-semibold mb-4 text-gray-300">Question Category</h3>
            <div className="flex flex-wrap gap-3 mb-8">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${category === c ? 'bg-primary text-white' : 'glass text-gray-400 hover:text-white'}`}>
                  {c}
                </button>
              ))}
            </div>

            <div className="glass p-5 mb-8">
              <h4 className="font-medium mb-2 text-sm text-gray-300">Before you begin:</h4>
              <ul className="text-sm text-gray-400 space-y-1.5">
                <li>• Allow camera and microphone access when prompted</li>
                <li>• Each question has a 2-minute time limit</li>
                <li>• Speak clearly and look at the camera for best results</li>
                <li>• Click the mic button to record your answer</li>
              </ul>
            </div>

            <button onClick={handleStart} disabled={!role || loading}
              className="btn-gradient w-full !py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><FaPlay /> Start Interview</>}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // PROCESSING PHASE
  if (phase === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <FaBrain className="text-3xl animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Interview</h2>
          <p className="text-gray-400 mb-6">Our AI is generating your personalized feedback...</p>
          <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  // INTERVIEW PHASE
  const progress = ((currentQ + 1) / questions.length) * 100;
  const mins = Math.floor(timer / 60);
  const secs = timer % 60;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="badge badge-primary">Question {currentQ + 1}/{questions.length}</span>
            <span className="badge badge-info">{role}</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg
            ${timer < 30 ? 'bg-red-500/20 text-red-400' : 'glass text-white'}`}>
            <HiClock /> {mins}:{secs.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar mb-6">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="glass p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`badge ${questions[currentQ]?.category === 'HR' ? 'badge-success' : questions[currentQ]?.category === 'Technical' ? 'badge-primary' : 'badge-warning'}`}>
                    {questions[currentQ]?.category}
                  </span>
                  {speaking && <span className="badge badge-info animate-pulse">🔊 Speaking...</span>}
                </div>
                <h2 className="text-xl font-semibold leading-relaxed">{questions[currentQ]?.question_text}</h2>
                <button onClick={() => speakQuestion(questions[currentQ]?.question_text)}
                  className="mt-3 text-sm text-primary hover:text-primary-light flex items-center gap-1">
                  <HiLightningBolt /> Read Aloud
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Answer Area */}
            <div className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-300">Your Answer</h3>
                <button onClick={toggleRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                  {isRecording ? <><FaMicrophoneSlash /> Stop Recording</> : <><FaMicrophone /> Start Recording</>}
                </button>
              </div>
              <textarea
                value={transcript || answers[currentQ]}
                onChange={(e) => {
                  const newA = [...answers];
                  newA[currentQ] = e.target.value;
                  setAnswers(newA);
                  setTranscript(e.target.value);
                }}
                className="input-glass w-full h-32 resize-none"
                placeholder="Click 'Start Recording' to speak your answer, or type here..."
              />
              {isRecording && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Recording... Speak your answer clearly
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              {currentQ < questions.length - 1 ? (
                <button onClick={handleNextQuestion} className="btn-gradient flex-1 !py-3.5 flex items-center justify-center gap-2">
                  Next Question <HiArrowRight />
                </button>
              ) : (
                <button onClick={() => handleFinish()} className="btn-gradient flex-1 !py-3.5 flex items-center justify-center gap-2 !from-green-500 !to-emerald-500">
                  <HiCheck /> Finish Interview
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Webcam & Analytics */}
          <div className="space-y-6">
            {/* Webcam */}
            <div className="glass p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">Webcam Feed</h3>
                <button onClick={webcamOn ? stopWebcam : startWebcam}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                  {webcamOn ? <><FaVideoSlash /> Off</> : <><FaVideo /> On</>}
                </button>
              </div>
              <div className="webcam-container bg-dark-800 aspect-video rounded-xl overflow-hidden">
                {webcamOn ? (
                  <>
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    <div className="emotion-overlay">
                      <span className="badge badge-primary text-xs">{currentEmotion}</span>
                      <span className="badge badge-info text-xs">{emotionConfidence}%</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                    <FaVideo className="mr-2" /> Camera Off
                  </div>
                )}
              </div>
            </div>

            {/* Live Stats */}
            <div className="glass p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Live Analytics</h3>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Eye Contact</span><span>{eyeContact}%</span>
                </div>
                <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${eyeContact}%` }} /></div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Emotion</span><span>{currentEmotion}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${emotionConfidence}%`, background: 'linear-gradient(90deg, #00ff88, #00d4ff)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-primary">{wordsSpoken}</div>
                  <div className="text-xs text-gray-500">Words</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-neon-orange">{fillerCount}</div>
                  <div className="text-xs text-gray-500">Fillers</div>
                </div>
              </div>
            </div>

            {/* Question List */}
            <div className="glass p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Progress</h3>
              <div className="space-y-1.5">
                {questions.map((_, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                    ${i === currentQ ? 'bg-primary/20 text-primary' : i < currentQ ? 'text-green-400' : 'text-gray-600'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                      ${i < currentQ ? 'bg-green-500/20' : i === currentQ ? 'bg-primary/30' : 'bg-white/5'}`}>
                      {i < currentQ ? '✓' : i + 1}
                    </div>
                    Q{i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
