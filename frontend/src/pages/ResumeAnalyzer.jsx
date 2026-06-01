import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { resumeAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileAlt, FaUpload, FaCode, FaQuestionCircle } from 'react-icons/fa';
import { HiLightningBolt, HiX } from 'react-icons/hi';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 16 * 1024 * 1024
  });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const res = await resumeAPI.upload(file);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Resume Analyzer</span>
          </h1>
          <p className="text-gray-400 mb-8">Upload your resume to get personalized interview questions</p>

          {!result ? (
            <>
              {/* Upload Area */}
              <div {...getRootProps()}
                className={`glass p-12 text-center cursor-pointer transition-all duration-300 mb-6
                  ${isDragActive ? 'border-primary bg-primary/10' : 'hover:bg-white/[0.06]'}`}>
                <input {...getInputProps()} />
                <FaUpload className="text-4xl text-primary mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-primary font-medium">Drop your resume here...</p>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">Drag & drop your resume here</p>
                    <p className="text-sm text-gray-400">or click to browse (PDF, max 16MB)</p>
                  </>
                )}
              </div>

              {file && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="glass p-4 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-primary text-xl" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => { setFile(null); setError(''); }}
                    className="text-gray-400 hover:text-red-400"><HiX size={20} /></button>
                </motion.div>
              )}

              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

              <button onClick={handleUpload} disabled={!file || loading}
                className="btn-gradient w-full !py-4 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><HiLightningBolt /> Analyze Resume</>}
              </button>
            </>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Skills Found */}
                <div className="glass p-6 mb-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FaCode className="text-primary" /> Skills Detected
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(result.resume_data?.skills || []).map(skill => (
                      <span key={skill} className="badge badge-primary !px-4 !py-1.5 text-sm">{skill}</span>
                    ))}
                    {result.resume_data?.skills?.length === 0 && (
                      <p className="text-sm text-gray-500">No specific skills detected. Try a more detailed resume.</p>
                    )}
                  </div>
                </div>

                {/* Projects */}
                {result.resume_data?.projects?.length > 0 && (
                  <div className="glass p-6 mb-6">
                    <h3 className="font-semibold mb-4">Projects Found</h3>
                    <ul className="space-y-2">
                      {result.resume_data.projects.map((p, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-primary">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Generated Questions */}
                <div className="glass p-6 mb-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FaQuestionCircle className="text-accent" /> Personalized Questions
                  </h3>
                  <div className="space-y-3">
                    {(result.questions || []).map((q, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge badge-primary text-xs">{q.skill}</span>
                        </div>
                        <p className="text-sm">{q.question}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => { setResult(null); setFile(null); }}
                  className="btn-outline w-full !py-3">
                  Analyze Another Resume
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}
