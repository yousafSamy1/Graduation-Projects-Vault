'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import Footer from '@/components/Footer';
import { Save, ArrowLeft, Loader, Plus, X, Sparkles, Linkedin, Github, Mail, Phone, Globe, Code, UserCheck } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/search';

export default function AddProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  
  const [studentForm, setStudentForm] = useState({
    name: '',
    linkedin: '',
    github: '',
    email: '',
    phone: '',
    portfolio: '',
  });

  const [form, setForm] = useState({
    project_code: '',
    title_en: '',
    title_ar: '',
    abstract_en: '',
    abstract_ar: '',
    year: new Date().getFullYear(),
    department: '',
    students: [],
    students_details: [],
    supervisor: '',
    ta: '',
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

  const addStudentDetail = () => {
    if (!studentForm.name.trim()) return;

    const newStudent = {
      name: studentForm.name.trim(),
      linkedin: studentForm.linkedin.trim() || null,
      github: studentForm.github.trim() || null,
      email: studentForm.email.trim() || null,
      phone: studentForm.phone.trim() || null,
      portfolio: studentForm.portfolio.trim() || null,
    };

    const updatedDetails = [...form.students_details, newStudent];
    const updatedNames = updatedDetails.map((s) => s.name);

    setForm((prev) => ({
      ...prev,
      students_details: updatedDetails,
      students: updatedNames,
    }));

    setStudentForm({
      name: '',
      linkedin: '',
      github: '',
      email: '',
      phone: '',
      portfolio: '',
    });
  };

  const removeStudentDetail = (index) => {
    const updatedDetails = form.students_details.filter((_, i) => i !== index);
    const updatedNames = updatedDetails.map((s) => s.name);
    setForm((prev) => ({
      ...prev,
      students_details: updatedDetails,
      students: updatedNames,
    }));
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

            {/* Project Code & Department & Year */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="input-group">
                <label htmlFor="project_code" style={{ color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Code size={16} style={{ color: '#1e3a8a' }} />
                  Project Code (كود المشروع)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. BT-2025-01"
                  value={form.project_code}
                  onChange={(e) => updateField('project_code', e.target.value)}
                  id="project_code"
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                />
              </div>

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

            {/* Supervisor & Teaching Assistant (TA) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="input-group">
                <label htmlFor="supervisor" style={{ color: '#0f172a', fontWeight: 800 }}>Supervisor (المشرف الاكاديمي)</label>
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

              <div className="input-group">
                <label htmlFor="ta" style={{ color: '#0f172a', fontWeight: 800 }}>Teaching Assistant / TA (المعيد)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Eng. / Mr. / Ms. ..."
                  value={form.ta}
                  onChange={(e) => updateField('ta', e.target.value)}
                  id="ta"
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Team Members with Contacts */}
            <div style={{ background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <label style={{ color: '#0f172a', fontWeight: 900, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                <UserCheck size={18} style={{ color: '#059669' }} />
                Team Members & Contact Info (أعضاء الفريق ووسائل التواصل)
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Student Name *"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                />
                <input
                  type="url"
                  className="input"
                  placeholder="LinkedIn URL (https://...)"
                  value={studentForm.linkedin}
                  onChange={(e) => setStudentForm({ ...studentForm, linkedin: e.target.value })}
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
                />
                <input
                  type="url"
                  className="input"
                  placeholder="GitHub URL (https://...)"
                  value={studentForm.github}
                  onChange={(e) => setStudentForm({ ...studentForm, github: e.target.value })}
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
                />
                <input
                  type="email"
                  className="input"
                  placeholder="Email (student@example.com)"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Phone / WhatsApp (+2010...)"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
                />
                <input
                  type="url"
                  className="input"
                  placeholder="Portfolio / Website URL"
                  value={studentForm.portfolio}
                  onChange={(e) => setStudentForm({ ...studentForm, portfolio: e.target.value })}
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
                />
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={addStudentDetail}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 800 }}
              >
                <Plus size={16} />
                Add Team Member to Project
              </button>

              {/* Added Members Cards Preview */}
              {form.students_details.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  {form.students_details.map((st, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                        border: '1.5px solid #bfdbfe',
                        borderRadius: '0.75rem',
                        padding: '0.75rem 1rem',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{st.name}</div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px', flexWrap: 'wrap' }}>
                          {st.linkedin && (
                            <span style={{ fontSize: '0.75rem', color: '#0077b5', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                              <Linkedin size={12} /> LinkedIn
                            </span>
                          )}
                          {st.github && (
                            <span style={{ fontSize: '0.75rem', color: '#333', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                              <Github size={12} /> GitHub
                            </span>
                          )}
                          {st.email && (
                            <span style={{ fontSize: '0.75rem', color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                              <Mail size={12} /> Email
                            </span>
                          )}
                          {st.phone && (
                            <span style={{ fontSize: '0.75rem', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                              <Phone size={12} /> Phone
                            </span>
                          )}
                          {st.portfolio && (
                            <span style={{ fontSize: '0.75rem', color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                              <Globe size={12} /> Website
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStudentDetail(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
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
