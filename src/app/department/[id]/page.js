'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { ArrowLeft, Search, Filter, FolderOpen, BookOpen, Users, GraduationCap } from 'lucide-react';
import { DEPARTMENTS, getDepartmentLabel } from '@/lib/search';

const DEPT_META = {
  'MIS': {
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
  },
  'BA': {
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
  },
  'Fintech': {
    color: '#059669',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    icon: '💳',
    gradient: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
  },
  'Marketing Intelligence': {
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
  },
};

export default function DepartmentPage() {
  const { id } = useParams();
  const router = useRouter();

  const deptId = decodeURIComponent(id);
  const meta = DEPT_META[deptId] || DEPT_META['MIS'];
  const nameEn = getDepartmentLabel(deptId, 'en');
  const nameAr = getDepartmentLabel(deptId, 'ar');

  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);

  useEffect(() => {
    router.replace(`/search?department=${encodeURIComponent(deptId)}`);
  }, [deptId, router]);

  useEffect(() => {
    applyFilters();
  }, [projects, searchQuery, selectedYear]);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/projects?pageSize=200&dept=${encodeURIComponent(deptId)}`
      );
      if (res.ok) {
        const data = await res.json();
        // API already filters by dept, no need to filter again
        const deptProjects = data.projects || [];
        // Sort by year desc
        deptProjects.sort((a, b) => b.year - a.year);
        setProjects(deptProjects);

        // Extract unique years
        const uniqueYears = [...new Set(deptProjects.map((p) => p.year))].sort(
          (a, b) => b - a
        );
        setYears(uniqueYears);
      }
    } catch (err) {
      console.error('Failed to fetch department projects:', err);
    }
    setLoading(false);
  }

  function applyFilters() {
    let result = [...projects];

    if (selectedYear) {
      result = result.filter((p) => p.year === parseInt(selectedYear));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.title_en || '').toLowerCase().includes(q) ||
          (p.title_ar || '').toLowerCase().includes(q) ||
          (p.supervisor || '').toLowerCase().includes(q) ||
          (p.abstract_en || '').toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }

  // Stats
  const totalProjects = projects.length;
  const supervisors = [...new Set(projects.map((p) => p.supervisor).filter(Boolean))].length;
  const totalStudents = projects.reduce(
    (acc, p) => acc + Math.max(p.students?.length || 0, p.students_details?.length || 0),
    0
  );

  return (
    <>
      <Navbar />

      {/* Department Hero Banner */}
      <section
        style={{
          background: meta.gradient,
          padding: '3rem 0 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '10%',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Link
            href="/"
            className="btn btn-ghost"
            style={{
              marginBottom: '1.5rem',
              color: 'rgba(255,255,255,0.85)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.1)',
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
            <div
              style={{
                fontSize: '3rem',
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
            >
              {meta.icon}
            </div>
            <div>
              <h1
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  marginBottom: '0.3rem',
                }}
              >
                {deptId}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '1rem' }}>
                {nameEn}
              </p>
              <p
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  direction: 'rtl',
                }}
              >
                {nameAr}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          {!loading && (
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                marginTop: '1.5rem',
              }}
            >
              {[
                { icon: <BookOpen size={16} />, val: totalProjects, label: 'Projects' },
                { icon: <GraduationCap size={16} />, val: supervisors || '—', label: 'Supervisors' },
                { icon: <Users size={16} />, val: totalStudents, label: 'Students' },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                  }}
                >
                  {stat.icon}
                  <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{stat.val}</span>
                  <span style={{ opacity: 0.8 }}>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filters + Projects */}
      <section style={{ padding: '2.5rem 0 4rem', position: 'relative', zIndex: 5 }}>
        <div className="container">
          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
              alignItems: 'center',
            }}
          >
            {/* Search */}
            <div className="search-container" style={{ flex: 1, minWidth: '240px' }}>
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder={`Search ${deptId} projects...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="dept-search"
              />
            </div>

            {/* Year Filter */}
            {years.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={16} style={{ color: meta.color }} />
                <select
                  className="select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  id="year-filter"
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    fontWeight: 700,
                    border: `2px solid ${meta.color}40`,
                    minWidth: '130px',
                  }}
                >
                  <option value="">All Years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Count */}
            <div
              style={{
                padding: '8px 16px',
                background: meta.bg,
                border: `2px solid ${meta.border}`,
                borderRadius: '10px',
                color: meta.color,
                fontWeight: 800,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
              }}
            >
              {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  border: `4px solid ${meta.color}30`,
                  borderTop: `4px solid ${meta.color}`,
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            </div>
          )}

          {/* Projects Grid */}
          {!loading && filtered.length > 0 && (
            <div className="projects-grid">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                background: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '1.25rem',
              }}
            >
              <FolderOpen size={56} style={{ color: meta.color, opacity: 0.5, marginBottom: '1rem' }} />
              <h3 style={{ color: '#0f172a', fontWeight: 900, marginBottom: '0.5rem' }}>
                No projects found
              </h3>
              <p style={{ color: '#64748b', fontWeight: 700 }}>
                {searchQuery
                  ? 'Try a different search term or clear filters.'
                  : `No ${deptId} projects in the archive yet.`}
              </p>
              {(searchQuery || selectedYear) && (
                <button
                  className="btn btn-secondary"
                  onClick={() => { setSearchQuery(''); setSelectedYear(''); }}
                  style={{ marginTop: '1rem' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
