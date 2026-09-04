'use client';

import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export default function SimilarityResult({ project, similarity }) {
  const percentage = Math.round(similarity * 100);
  
  let level, icon, message;
  if (percentage >= 70) {
    level = 'high';
    icon = <AlertTriangle size={20} />;
    message = 'High similarity detected! This project idea may already exist.';
  } else if (percentage >= 30) {
    level = 'medium';
    icon = <AlertCircle size={20} />;
    message = 'Moderate similarity. Review the project for potential overlap.';
  } else {
    level = 'low';
    icon = <CheckCircle size={20} />;
    message = 'Low similarity. Your idea appears to be unique!';
  }

  const title = project.title_en || project.title_ar || 'Untitled';
  const abstract = project.abstract_en || project.abstract_ar || '';

  return (
    <div 
      className="card animate-fade-in-up" 
      id={`similarity-result-${project.id}`}
      style={{ 
        background: '#ffffff', 
        border: '2px solid #cbd5e1', 
        borderRadius: '1rem',
        boxShadow: '0 4px 15px rgba(15, 23, 42, 0.06)' 
      }}
    >
      <div className="card-body" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              display: 'inline-flex', 
              padding: '6px 12px', 
              borderRadius: '8px',
              background: percentage >= 70 ? '#fee2e2' : percentage >= 30 ? '#fef3c7' : '#d1fae5',
              color: percentage >= 70 ? '#dc2626' : percentage >= 30 ? '#d97706' : '#059669',
              fontWeight: 800
            }}>
              {icon}
            </span>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                {project.department} • {project.year}
              </p>
            </div>
          </div>
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: 900, 
            color: percentage >= 70 ? '#dc2626' : percentage >= 30 ? '#d97706' : '#059669' 
          }}>
            {percentage}%
          </span>
        </div>

        <div style={{ 
          height: '8px', 
          width: '100%', 
          background: '#e2e8f0', 
          borderRadius: '9999px', 
          overflow: 'hidden', 
          marginBottom: '0.75rem' 
        }}>
          <div style={{ 
            height: '100%', 
            width: `${percentage}%`, 
            background: percentage >= 70 ? '#dc2626' : percentage >= 30 ? '#d97706' : '#059669',
            borderRadius: '9999px' 
          }} />
        </div>

        <p style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 700, marginBottom: '0.75rem' }}>
          {message}
        </p>

        <p style={{ 
          fontSize: '0.9rem', 
          color: '#334155', 
          lineHeight: 1.6,
          fontWeight: 500,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {abstract}
        </p>

        {project.supervisor && (
          <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700, marginTop: '0.75rem' }}>
            Supervisor: {project.supervisor}
          </p>
        )}
      </div>
    </div>
  );
}
