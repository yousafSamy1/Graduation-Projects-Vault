'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, User, Users, BookOpen, Download, Tag, Star, Loader } from 'lucide-react';

const departmentBadgeClass = {
  'MIS': 'badge-mis',
  'BA': 'badge-ba',
  'Fintech': 'badge-fintech',
  'Marketing Intelligence': 'badge-marketing',
};

export default function ProjectDetailPage({ params }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects?id=${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project);
        }
      } catch (err) {
        console.error('Failed to fetch project:', err);
      }
      setLoading(false);
    }
    fetchProject();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Loader size={36} style={{ animation: 'spin 1s linear infinite', color: '#1e3a8a' }} />
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: 600 }}>
          <div style={{
            background: '#ffffff',
            border: '2px solid #cbd5e1',
            borderRadius: '1.25rem',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)'
          }}>
            <h2 style={{ color: '#0f172a', fontWeight: 900, marginBottom: '0.75rem' }}>Project Not Found</h2>
            <p style={{ color: '#1e293b', fontWeight: 700, marginBottom: '1.5rem' }}>
              The project you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/search" className="btn btn-primary">Back to Search</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const title = project.title_en || project.title_ar || 'Untitled Project';
  const badgeClass = departmentBadgeClass[project.department] || 'badge-mis';

  return (
    <>
      <Navbar />

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: 900 }}>
        <div style={{
          background: '#ffffff',
          border: '2px solid #cbd5e1',
          borderRadius: '1.25rem',
          padding: '2.5rem 2rem',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Back Button */}
          <Link
            href="/search"
            className="btn btn-ghost"
            style={{ marginBottom: '1.5rem' }}
            id="back-to-search"
          >
            <ArrowLeft size={16} />
            Back to Search
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <span className={`badge ${badgeClass}`} style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              {project.department}
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.75rem' }}>
              {title}
            </h1>
            {project.title_ar && project.title_en && (
              <p className="text-arabic" style={{ 
                fontSize: '1.35rem', 
                color: '#1e293b', 
                fontWeight: 700,
                marginTop: '0.5rem' 
              }}>
                {project.title_ar}
              </p>
            )}

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.9rem', fontWeight: 700, color: '#475569', flexWrap: 'wrap' }}>
              {project.year && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Calendar size={15} /> {project.year}</span>
              )}
              {project.supervisor && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={15} /> Supervisor: {project.supervisor}</span>
              )}
              {project.rating > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Star size={15} style={{ color: '#d97706' }} /> {project.rating}/5</span>
              )}
            </div>
          </div>

          {/* Abstract English */}
          {project.abstract_en && (
            <div style={{ background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 900, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} style={{ color: '#1e3a8a' }} /> Abstract (English)
              </h2>
              <p style={{ color: '#1e293b', fontSize: '1rem', lineHeight: 1.7, fontWeight: 600 }}>{project.abstract_en}</p>
            </div>
          )}

          {/* Abstract Arabic */}
          {project.abstract_ar && (
            <div style={{ background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 className="text-arabic" style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 900, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} style={{ color: '#dc2626' }} /> الملخص (عربي)
              </h2>
              <p className="text-arabic" style={{ color: '#1e293b', fontSize: '1.05rem', lineHeight: 1.8, fontWeight: 600 }}>{project.abstract_ar}</p>
            </div>
          )}

          {/* Students */}
          {project.students && project.students.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 900, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} style={{ color: '#059669' }} /> Team Members
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {project.students.map((student, i) => (
                  <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: '1.5px solid #cbd5e1', padding: '6px 14px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    <User size={14} />
                    {student}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {project.keywords && project.keywords.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 900, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={18} style={{ color: '#2563eb' }} /> Keywords
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.keywords.map((keyword, i) => (
                  <span key={i} style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1e3a8a', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700 }}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PDF Download */}
          {project.pdf_url && (
            <div style={{ marginTop: '2rem' }}>
              <a
                href={project.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                id="download-pdf-btn"
              >
                <Download size={18} />
                Download Full PDF
              </a>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
