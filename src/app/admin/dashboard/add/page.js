'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import Footer from '@/components/Footer';
import { Save, ArrowLeft, Loader, Plus, X, Sparkles } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/search';

export default function AddProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [studentInput, setStudentInput] = useState('');

  const [form, setForm] = useState({
    title_en: '',
    title_ar: '',
    abstract_en: '',
    abstract_ar: '',
    year: new Date().getFullYear(),
    department: '',
    students: [],
    supervisor: '',
    keywords: [],
    rating: 0,
  });

  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
    }
  }, [router]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !form.keywords.includes(keyword)) {
      updateField('keywords', [...form.keywords, keyword]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    updateField('keywords', form.keywords.filter((_, i) => i !== index));
  };

  const addStudent = () => {
    const student = studentInput.trim();
    if (student && !form.students.includes(student)) {
      updateField('students', [...form.students, student]);
      setStudentInput('');
    }
  };

  const removeStudent = (index) => {
    updateField('students', form.students.filter((_, i) => i !== index));
  };

  const handlePDFExtract = async (file) => {
    setPdfFile(file);
    if (!file) return;

    setExtracting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          if (!form.abstract_en && !form.abstract_ar) {
            const arabicChars = (data.text.match(/[\u0600-\u06FF]/g) || []).length;
            const latinChars = (data.text.match(/[a-zA-Z]/g) || []).length;

            if (arabicChars > latinChars) {
              updateField('abstract_ar', data.text.substring(0, 5000));
            } else {
              updateField('abstract_en', data.text.substring(0, 5000));
            }
          }
        }
        if (data.pdf_url) {
          updateField('pdf_url', data.pdf_url);
        }
      }
    } catch (err) {
      console.error('PDF extraction failed:', err);
    }
    setExtracting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!form.department) {
        throw new Error('Please select a department');
      }
      if (!form.title_en && !form.title_ar) {
        throw new Error('Please provide a title in English or Arabic');
      }

      const token = localStorage.getItem('admin_token');
      
      let pdfUrl = form.pdf_url;
      if (pdfFile && !pdfUrl) {
        const formData = new FormData();
        formData.append('file', pdfFile);
        const uploadRes = await fetch('/api/upload-pdf', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          pdfUrl = uploadData.pdf_url;
        }
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, pdf_url: pdfUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add project');
      }

      setSuccess('Project added successfully!');
      setTimeout(() => router.push('/admin/dashboard'), 1500);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= currentYear - 15; y--) {
    years.push(y);
  }

  return (
    <>
      <Navbar />

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: 850 }}>
        {/* Solid White Main Panel Box */}
        <div style={{
          background: '#ffffff',
          border: '2px solid #cbd5e1',
          borderRadius: '1.25rem',
          padding: '2.5rem 2rem',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Header */}
          <button
            className="btn btn-ghost"
            onClick={() => router.back()}
            style={{ marginBottom: '1.5rem', color: '#0f172a', fontWeight: 800 }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="animate-fade-in-down" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
              Add New <span className="text-gradient">Project</span>
            </h1>
            <p style={{ color: '#1e293b', fontWeight: 700, fontSize: '1rem' }}>
              Fill in the project details. AI will automatically generate embeddings for smart search.
            </p>
          </div>

          {/* Success */}
          {success && (
            <div style={{ 
              padding: '1rem', 
              background: '#d1fae5',
              border: '2px solid #6ee7b7',
              borderRadius: '0.75rem',
              color: '#065f46',
              fontSize: '0.9rem',
              fontWeight: 800,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Sparkles size={16} />
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ 
              padding: '1rem', 
              background: '#fee2e2',
              border: '2px solid #fca5a5',
              borderRadius: '0.75rem',
              color: '#991b1b',
              fontSize: '0.9rem',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="animate-fade-in-up">
            {/* PDF Upload */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'block' }}>
                Upload PDF (optional - will auto-extract abstract)
              </label>
              <FileUpload onFileSelect={handlePDFExtract} />
              {extracting && (
                <p style={{ fontSize: '0.875rem', color: '#1e3a8a', fontWeight: 800, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Extracting text from PDF...
                </p>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '2px solid #e2e8f0', margin: '1.5rem 0' }} />

            {/* Title English */}
            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="title-en" style={{ color: '#0f172a', fontWeight: 800 }}>Title (English)</label>
              <input
                type="text"
                className="input"
                placeholder="Project title in English"
                value={form.title_en}
                onChange={(e) => updateField('title_en', e.target.value)}
                id="title-en"
                style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
              />
            </div>

            {/* Title Arabic */}
            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="title-ar" style={{ color: '#0f172a', fontWeight: 800 }}>Title (Arabic) - العنوان بالعربي</label>
              <input
                type="text"
                className="input text-arabic"
                placeholder="عنوان المشروع بالعربي"
                value={form.title_ar}
                onChange={(e) => updateField('title_ar', e.target.value)}
                id="title-ar"
                style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
              />
            </div>

            {/* Abstract English */}
            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="abstract-en" style={{ color: '#0f172a', fontWeight: 800 }}>Abstract (English)</label>
              <textarea
                className="textarea"
                placeholder="Project abstract in English..."
                value={form.abstract_en}
                onChange={(e) => updateField('abstract_en', e.target.value)}
                id="abstract-en"
                style={{ background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
              />
            </div>

            {/* Abstract Arabic */}
            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="abstract-ar" style={{ color: '#0f172a', fontWeight: 800 }}>Abstract (Arabic) - الملخص بالعربي</label>
              <textarea
                className="textarea text-arabic"
                placeholder="ملخص المشروع بالعربي..."
                value={form.abstract_ar}
                onChange={(e) => updateField('abstract_ar', e.target.value)}
                id="abstract-ar"
                style={{ background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
              />
            </div>

            {/* Department & Year */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="input-group">
                <label htmlFor="department" style={{ color: '#0f172a', fontWeight: 800 }}>Department *</label>
                <select
                  className="select"
                  value={form.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  required
                  id="department"
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="year" style={{ color: '#0f172a', fontWeight: 800 }}>Year *</label>
                <select
                  className="select"
                  value={form.year}
                  onChange={(e) => updateField('year', parseInt(e.target.value))}
                  required
                  id="year"
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Supervisor */}
            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="supervisor" style={{ color: '#0f172a', fontWeight: 800 }}>Supervisor</label>
              <input
                type="text"
                className="input"
                placeholder="Dr. ..."
                value={form.supervisor}
                onChange={(e) => updateField('supervisor', e.target.value)}
                id="supervisor"
                style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
              />
            </div>

            {/* Students */}
            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ color: '#0f172a', fontWeight: 800 }}>Students</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Student name"
                  value={studentInput}
                  onChange={(e) => setStudentInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStudent(); } }}
                  id="student-input"
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                />
                <button type="button" className="btn btn-secondary" onClick={addStudent}>
                  <Plus size={16} />
                </button>
              </div>
              {form.students.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {form.students.map((student, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1e3a8a', padding: '4px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                      {student}
                      <button
                        type="button"
                        onClick={() => removeStudent(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 0, display: 'flex' }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Keywords */}
            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ color: '#0f172a', fontWeight: 800 }}>Keywords</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Add keyword"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                  id="keyword-input"
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                />
                <button type="button" className="btn btn-secondary" onClick={addKeyword}>
                  <Plus size={16} />
                </button>
              </div>
              {form.keywords.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {form.keywords.map((kw, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef3c7', border: '1.5px solid #fcd34d', color: '#92400e', padding: '4px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                      {kw}
                      <button
                        type="button"
                        onClick={() => removeKeyword(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 0, display: 'flex' }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="input-group" style={{ marginBottom: '2rem' }}>
              <label htmlFor="rating" style={{ color: '#0f172a', fontWeight: 800 }}>Rating (0-5)</label>
              <input
                type="number"
                className="input"
                min="0"
                max="5"
                step="0.5"
                value={form.rating}
                onChange={(e) => updateField('rating', parseFloat(e.target.value) || 0)}
                id="rating"
                style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
              id="submit-project"
            >
              {loading ? (
                <>
                  <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Adding Project & Generating AI Embeddings...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Project
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
