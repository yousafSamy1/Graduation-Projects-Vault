'use client';

import Link from 'next/link';
import { User, BookOpen, ArrowRight, Code, Video, Monitor, BarChart3, CreditCard, Target, Folder } from 'lucide-react';
import { getDepartmentLabel } from '@/lib/search';

const departmentBadgeClass = {
  'MIS': 'badge-mis',
  'BA': 'badge-ba',
  'Fintech': 'badge-fintech',
  'Marketing Intelligence': 'badge-marketing',
};

const DEPT_COLORS = {
  'MIS': '#dc2626',
  'BA': '#d97706',
  'Fintech': '#059669',
  'Marketing Intelligence': '#2563eb',
};

const DEPT_GRADIENTS = {
  'MIS': 'linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%)',
  'BA': 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
  'Fintech': 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
  'Marketing Intelligence': 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
};

const DEPT_ICONS = {
  'MIS': Monitor,
  'BA': BarChart3,
  'Fintech': CreditCard,
  'Marketing Intelligence': Target,
};

export default function ProjectCard({ project, index = 0 }) {
  const title = project.title_en || project.title_ar || 'Untitled Project';
  const abstract = project.abstract_en || project.abstract_ar || '';
  const badgeClass = departmentBadgeClass[project.department] || 'badge-mis';
  const departmentLabel = getDepartmentLabel(project.department);
  const deptColor = DEPT_COLORS[project.department] || '#1e3a8a';
  const deptGradient = DEPT_GRADIENTS[project.department] || DEPT_GRADIENTS['MIS'];
  const IconComp = DEPT_ICONS[project.department] || Folder;

  return (
    <Link
      href={`/project/${project.id}`}
      className="card project-card animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
      id={`project-card-${project.id}`}
    >
      {/* Project Image or Colored Header */}
      <div style={{
        position: 'relative',
        height: '140px',
        overflow: 'hidden',
        borderRadius: '12px 12px 0 0',
        flexShrink: 0,
      }}>
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={title}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: deptGradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '8px',
          }}>
            <div style={{ color: 'white' }}>
              <IconComp size={36} />
            </div>
            {project.project_code && (
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: 900,
                fontFamily: 'monospace',
              }}>
                {project.project_code}
              </span>
            )}
          </div>
        )}

        {/* Drive badge */}
        {project.drive_url && (
          <span style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'rgba(220,38,38,0.9)',
            color: 'white',
            padding: '3px 8px',
            borderRadius: '20px',
            fontSize: '0.68rem',
            fontWeight: 900,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            backdropFilter: 'blur(4px)',
          }}>
            <Video size={9} /> Demo
          </span>
        )}

        {/* Year badge */}
        <span style={{
          position: 'absolute', top: '8px', left: '8px',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '3px 8px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 900,
          backdropFilter: 'blur(4px)',
        }}>
          {project.year}
        </span>
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
        <div className="project-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '0.65rem' }}>
          <span className={`badge ${badgeClass}`}>{departmentLabel}</span>
          {project.project_code && (
            <span style={{ fontSize: '0.73rem', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', color: '#0f172a', fontWeight: 800, fontFamily: 'monospace' }}>
              <Code size={10} style={{ display: 'inline', marginRight: '2px' }} />
              {project.project_code}
            </span>
          )}
        </div>

        <h3 className="project-card-title" style={{ 
          color: '#0f172a', 
          fontWeight: 800, 
          fontSize: '1.05rem', 
          lineHeight: 1.35, 
          marginBottom: '0.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.7em'
        }}>
          {title}
        </h3>

        <p className="project-card-abstract" style={{ 
          color: '#334155', 
          fontWeight: 500, 
          fontSize: '0.88rem', 
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '4.65em',
          marginBottom: '1rem'
        }}>
          {abstract || 'Graduation project archived in the faculty repository.'}
        </p>

        <div className="project-card-meta" style={{ marginTop: 'auto', borderTop: '1.5px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {project.supervisor && (
            <span style={{ color: '#334155', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
              <User size={13} />
              {project.supervisor}
            </span>
          )}
          {(() => {
            const count = Math.max(project.students?.length || 0, project.students_details?.length || 0);
            return count > 0 ? (
              <span style={{ color: '#334155', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                <BookOpen size={13} />
                {count} student{count > 1 ? 's' : ''}
              </span>
            ) : null;
          })()}
          <span style={{ marginLeft: 'auto', color: '#1e3a8a', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
            View <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
