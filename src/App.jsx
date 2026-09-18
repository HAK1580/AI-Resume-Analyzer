import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  Import
} from 'lucide-react';

export const ResumeAnalyzer = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  
  const API= 'http://localhost:5000' || import.meta.env.VITE_API_URL
  const onSubmit = async (formData) => {
    setApiError(null);
    setAnalysisResult(null);

    const data = new FormData();
    data.append('resume', formData.resume);
    if (formData.jobDescription) {
      data.append('jobDescription', formData.jobDescription);
    }

    try {
      const response = await axios.post(`${API}/api/ai/analyze-resume`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setApiError(error.response?.data?.error || 'Failed to analyze resume. Please try again.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-500 stroke-amber-500 bg-amber-500/10';
    return 'text-rose-500 stroke-rose-500 bg-rose-500/10';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Resume & ATS Score Analyzer
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Upload your resume PDF and match it against job descriptions to get instant ATS optimization metrics.
          </p>
        </div>

        {/* Input Form & Upload Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          
          {/* File Upload Zone */}
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-semibold text-slate-300">Upload Resume (PDF)</label>
            <Controller
              name="resume"
              control={control}
              rules={{ required: 'Please upload a PDF file' }}
              render={({ field: { onChange, value } }) => {
                const { getRootProps, getInputProps, isDragActive } = useDropzone({
                  accept: { 'application/pdf': ['.pdf'] },
                  maxFiles: 1,
                  onDrop: (acceptedFiles) => {
                    if (acceptedFiles.length > 0) onChange(acceptedFiles[0]);
                  },
                });

                return (
                  <div className="flex-1 flex flex-col justify-center">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center h-48 ${
                        isDragActive 
                          ? 'border-indigo-500 bg-indigo-500/10' 
                          : 'border-slate-700 hover:border-slate-500 bg-slate-950/50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <UploadCloud className="w-10 h-10 text-indigo-400 mb-2" />
                      <p className="text-sm font-medium text-slate-300">
                        {isDragActive ? 'Drop PDF here...' : 'Drag & drop PDF resume here'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Supports PDF up to 5MB</p>
                    </div>

                    {value && (
                      <div className="mt-3 flex items-center gap-2 p-2.5 bg-slate-800/80 rounded-lg text-xs text-slate-300 border border-slate-700">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="truncate">{value.name}</span>
                      </div>
                    )}
                  </div>
                );
              }}
            />
            {errors.resume && <p className="text-xs text-rose-400 mt-1">{errors.resume.message}</p>}
          </div>

          {/* Job Description & Submit */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">
                Target Job Description <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <textarea
                {...register('jobDescription')}
                rows={5}
                placeholder="Paste the target job description to run keyword match analysis..."
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-600 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Run AI ATS Scan
                </>
              )}
            </button>
          </div>
        </form>

        {/* API Error Notification */}
        {apiError && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Results Analytics Dashboard */}
        {analysisResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Top Score Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 items-center">
              <div className="flex flex-col items-center justify-center md:border-r border-slate-800 p-4">
                <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 ${getScoreColor(analysisResult.ATS_score)}`}>
                  <span className="text-3xl font-extrabold">{analysisResult.ATS_score}</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">/ 100 ATS</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  Executive AI Feedback
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {analysisResult.cv_compatibility}
                </p>
              </div>
            </div>

            {/* Missing Keywords & Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Missing Keywords Badges */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missing_keywords?.map((kw, idx) => (
                    <span key={idx} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-medium">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Areas for Improvement
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysisResult.areas_for_improvement?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                      <span className="text-indigo-400 font-bold">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>``
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeAnalyzer;