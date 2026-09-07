'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, ExternalLink, Video, Monitor, BarChart3, CreditCard, Target } from 'lucide-react';

const DEPT_COLORS = {
  'MIS': { color: '#dc2626', bg: '#fef2f2', label: 'MIS' },
  'BA': { color: '#d97706', bg: '#fffbeb', label: 'BA' },
  'Fintech': { color: '#059669', bg: '#f0fdf4', label: 'Fintech' },
  'Marketing Intelligence': { color: '#2563eb', bg: '#eff6ff', label: 'MKI' },
};

const PLACEHOLDER_COLORS = [
  'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
  'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
  'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
  'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)',
];

export default function ProjectsBanner({ projects = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  const displayProjects = projects; // Show all projects from all departments

  const goTo = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goNext = () => {
    goTo((currentIndex + 1) % displayProjects.length);
  };

  const goPrev = () => {
    goTo((currentIndex - 1 + displayProjects.length) % displayProjects.length);
  };

  useEffect(() => {
    if (displayProjects.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayProjects.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [displayProjects.length]);

  if (displayProjects.length === 0) return null;

  const project = displayProjects[currentIndex];
  const dept = DEPT_COLORS[project.department] || DEPT_COLORS['MIS'];
  const bgGrad = PLACEHOLDER_COLORS[currentIndex % PLACEHOLDER_COLORS.length];
  const title = project.title_en || project.title_ar || 'Untitled Project';
  const abstract = project.abstract_en || project.abstract_ar || '';

  return (
    <section
      style={{ padding: '2.5rem 0', position: 'relative', zIndex: 5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
            Featured <span className="text-gradient">Graduation Projects</span>
          </h2>
          <Link href="/search" className="btn btn-ghost" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e3a8a' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Banner Card (Sleek & Compact) */}
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(15,23,42,0.08)',
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 40%) 1fr',
            minHeight: '260px',
            maxHeight: '300px',
            transition: 'box-shadow 0.3s ease',
            position: 'relative',
          }}
        >
          {/* Left: Image / Visual */}
          <div
            style={{
              background: project.image_url ? '#0f172a' : bgGrad,
              position: 'relative',
              overflow: 'hidden',
              minHeight: '260px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.4s ease',
                  opacity: isTransitioning ? 0.6 : 1,
                }}
              />
            ) : (
              /* Decorative placeholder */
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.25rem' }}>
                <div style={{
                  color: 'white',
                  filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))',
                }}>
                  {project.department === 'MIS' ? <Monitor size={48} /> :
                   project.department === 'BA' ? <BarChart3 size={48} /> :
                   project.department === 'Fintech' ? <CreditCard size={48} /> : <Target size={48} />}
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  borderRadius: '10px',
                  padding: '4px 14px',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  backdropFilter: 'blur(4px)',
                }}>
                  {project.project_code || project.department}
                </div>
                <p style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textAlign: 'center',
                }}>
                  {project.year} Graduation Project
                </p>
              </div>
            )}

            {/* Slide counter overlay */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.55)',
              color: 'white',
              padding: '3px 8px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: 800,
              backdropFilter: 'blur(4px)',
            }}>
              {currentIndex + 1} / {displayProjects.length}
            </div>
          </div>

          {/* Right: Content */}
          <div style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: isTransitioning ? 0.7 : 1,
            transition: 'opacity 0.3s ease',
            overflow: 'hidden',
          }}>
            <div>
              {/* Tags */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                <span style={{
                  background: dept.bg,
                  color: dept.color,
                  border: `1.5px solid ${dept.color}40`,
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                }}>
                  {dept.label}
                </span>
                <span style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1.5px solid #cbd5e1',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}>
                  {project.year}
                </span>
                {project.drive_url && (
                  <span style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1.5px solid #fecaca',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Video size={10} /> Demo Video
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.3,
                marginBottom: '0.45rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {title}
              </h3>

              {/* Abstract */}
              {abstract && (
                <p style={{
                  color: '#475569',
                  fontSize: '0.84rem',
                  lineHeight: 1.5,
                  fontWeight: 600,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                }}>
                  {abstract}
                </p>
              )}

              {/* Students */}
              {(project.students?.length > 0 || project.students_details?.length > 0) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(project.students_details?.length > 0 ? project.students_details : project.students?.map(n => ({ name: n })) || [])
                    .slice(0, 3)
                    .map((s, i) => (
                      <span key={i} style={{
                        fontSize: '0.72rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        color: '#334155',
                        fontWeight: 700,
                      }}>
                        {typeof s === 'string' ? s : s.name}
                      </span>
                    ))}
                  {Math.max(project.students?.length || 0, project.students_details?.length || 0) > 3 && (
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                      +{Math.max(project.students?.length || 0, project.students_details?.length || 0) - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom: Actions + Nav */}
            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <Link
                href={`/project/${project.id}`}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                View Project <ArrowRight size={13} />
              </Link>

              {/* Nav Arrows */}
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <button
                  onClick={goPrev}
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    border: '1.5px solid #cbd5e1',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#475569',
                    transition: 'all 0.2s',
                  }}
                  aria-label="Previous project"
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  onClick={goNext}
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: '#1e3a8a',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    transition: 'all 0.2s',
                  }}
                  aria-label="Next project"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Progress bar at top */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '4px',
            background: `linear-gradient(to right, ${dept.color}, ${dept.color}80)`,
            borderRadius: '2px 2px 0 0',
            width: `${((currentIndex + 1) / displayProjects.length) * 100}%`,
            transition: 'width 0.4s ease, background 0.4s ease',
          }} />
        </div>

        {/* Dots navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginTop: '1rem', maxWidth: '750px', marginLeft: 'auto', marginRight: 'auto' }}>
          {displayProjects.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === currentIndex ? (DEPT_COLORS[displayProjects[i].department]?.color || '#1e3a8a') : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
