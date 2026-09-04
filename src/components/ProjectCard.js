'use client';

import Link from 'next/link';
import { User, BookOpen, ArrowRight, Code } from 'lucide-react';
import { getDepartmentLabel } from '@/lib/search';

const departmentBadgeClass = {
  'MIS': 'badge-mis',
  'BA': 'badge-ba',
  'Fintech': 'badge-fintech',
  'Marketing Intelligence': 'badge-marketing',
};

export default function ProjectCard({ project, index = 0 }) {
  const title = project.title_en || project.title_ar || 'Untitled Project';
  const abstract = project.abstract_en || project.abstract_ar || '';
  const badgeClass = departmentBadgeClass[project.department] || 'badge-mis';
  const departmentLabel = getDepartmentLabel(project.department);

  return (
    <Link
      href={`/project/${project.id}`}
      className="card project-card animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
      id={`project-card-${project.id}`}
    >
      <div className="card-body">
        <div className="project-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          <span className={`badge ${badgeClass}`}>{departmentLabel}</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {project.project_code && (
              <span style={{ fontSize: '0.75rem', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', color: '#0f172a', fontWeight: 800, fontFamily: 'monospace' }}>
                <Code size={10} style={{ display: 'inline', marginRight: '3px' }} />
                {project.project_code}
              </span>
            )}
            {project.year && (
              <span style={{ fontSize: '0.8rem', color: '#1e3a8a', fontWeight: 800 }}>
                {project.year}
              </span>
            )}
          </div>
        </div>

        <h3 className="project-card-title" style={{ color: '#0f172a', fontWeight: 800 }}>{title}</h3>
        <p className="project-card-abstract" style={{ color: '#1e293b', fontWeight: 500 }}>{abstract}</p>

        <div className="project-card-meta">
          {project.supervisor && (
            <span style={{ color: '#334155', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} />
              {project.supervisor}
            </span>
          )}
          {(() => {
            const count = Math.max(project.students?.length || 0, project.students_details?.length || 0);
            return count > 0 ? (
              <span style={{ color: '#334155', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <BookOpen size={14} />
                {count} student{count > 1 ? 's' : ''}
              </span>
            ) : null;
          })()}
          <span style={{ marginLeft: 'auto', color: '#1e3a8a', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            View <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
