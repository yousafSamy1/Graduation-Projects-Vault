'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import { Search, GitCompareArrows, ArrowRight, Award, Calendar } from 'lucide-react';

const DEPARTMENTS = [
  { id: 'MIS', nameEn: 'Management Information Systems', nameAr: 'نظم المعلومات الإدارية', color: '#dc2626', icon: '💻' },
  { id: 'BA', nameEn: 'Business Analytics', nameAr: 'تحليلات الأعمال', color: '#d97706', icon: '📊' },
  { id: 'Fintech', nameEn: 'Digital Banking and Fintech', nameAr: 'البنوك الرقمية والتكنولوجيا المالية', color: '#059669', icon: '💳' },
  { id: 'Marketing Intelligence', nameEn: 'Marketing Intelligence', nameAr: 'ذكاء التسويق', color: '#2563eb', icon: '🎯' },
];

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, departments: 4, years: 0, supervisors: 0 });
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats || { total: 0, departments: 4, years: 0, supervisors: 0 });
          setFeaturedProjects(data.featured || []);
        }
      } catch (err) {
        console.log('Stats not available yet');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const yearsList = [2026, 2025, 2024, 2023, 2022, 2021];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero" id="hero-section" style={{ position: 'relative', padding: '4.5rem 0 3.5rem', zIndex: 5 }}>
        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          
          {/* Institution Badge */}
          <div className="animate-fade-in-down" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '8px 22px',
              background: '#ffffff',
              border: '2px solid #cbd5e1',
              borderRadius: '9999px',
              boxShadow: '0 4px 15px rgba(15, 23, 42, 0.08)'
            }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img src="/logo.png" alt="ERU Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '0.9rem', color: '#1e3a8a', fontWeight: 800 }}>
                Egyptian Russian University • Business Technology Department
              </span>
            </div>
          </div>

          {/* Titles & Hero Copy */}
          <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>
            <h1 className="animate-fade-in-up" style={{ 
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', 
              fontWeight: 900, 
              color: '#0f172a',
              lineHeight: 1.2, 
              marginBottom: '1.25rem'
            }}>
              Graduation Projects Vault<br />
              <span className="text-gradient">AI-Powered Search & Compare</span>
            </h1>
            
            <p className="animate-fade-in-up" style={{ 
              fontSize: '1.15rem', 
              color: '#1e293b', 
              lineHeight: 1.6, 
              marginBottom: '2rem',
              fontWeight: 700
            }}>
              Explore previous projects archive across all college departments or verify your project proposal for originality using AI embedding analysis.
            </p>
            
            {/* Search Bar */}
            <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
              <SearchBar size="large" />
            </div>

            {/* Quick Actions */}
            <div className="animate-fade-in-up hero-actions" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <Link href="/search" className="btn btn-primary btn-lg" id="hero-search-btn">
                <Search size={18} />
                Browse All Projects
              </Link>
              <Link href="/compare" className="btn btn-accent btn-lg" id="hero-compare-btn">
                <GitCompareArrows size={18} />
                Compare Idea (AI)
              </Link>
            </div>

            {/* Browse By Academic Year Dropdown Picker */}
            <div className="animate-fade-in-up" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background: '#ffffff',
              border: '2px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '8px 22px',
              boxShadow: '0 4px 15px rgba(15, 23, 42, 0.08)',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 800, fontSize: '0.92rem' }}>
                <Calendar size={18} style={{ color: '#dc2626' }} />
                <span>Filter Archive by Academic Year / اختر السنة الدراسية:</span>
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/search?year=${e.target.value}`);
                  }
                }}
                defaultValue=""
                style={{
                  padding: '6px 18px',
                  borderRadius: '9999px',
                  border: '2px solid #1e3a8a',
                  background: '#f8fafc',
                  color: '#1e3a8a',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(30, 58, 138, 0.1)'
                }}
                id="homepage-year-picker"
              >
                <option value="" disabled>📅 Select Year / اختر السنة...</option>
                {yearsList.map((y) => (
                  <option key={y} value={y}>🎓 Class of {y} ({y})</option>
                ))}
              </select>
            </div>

          </div>

          {/* Department Cards Grid */}
          <div style={{ 
            marginTop: '3.5rem', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '1.25rem' 
          }}>
            {DEPARTMENTS.map((dept) => (
              <Link 
                key={dept.id} 
                href={`/search?dept=${encodeURIComponent(dept.id)}`} 
                style={{ textDecoration: 'none' }}
              >
                <div className="card" style={{ 
                  padding: '1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  background: '#ffffff',
                  border: `2px solid ${dept.color}`,
                  boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)'
                }}>
                  <div style={{ 
                    fontSize: '24px', 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '12px', 
                    background: `${dept.color}15`,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {dept.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {dept.id}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 700 }}>
                      {dept.nameEn}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Stats Section (Video visible in background, cards are solid white) */}
      <section className="section" id="stats-section" style={{ padding: '3rem 0', position: 'relative', zIndex: 5 }}>
        <div className="container">
          <div className="stats-grid">
            <div className="card stat-card" style={{ borderTop: '4px solid #dc2626', background: '#ffffff', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)' }}>
              <div className="stat-number" style={{ color: '#0f172a', fontWeight: 900 }}>{stats.total}+</div>
              <div className="stat-label" style={{ color: '#1e293b', fontWeight: 800 }}>Archived Projects</div>
            </div>
            <div className="card stat-card" style={{ borderTop: '4px solid #d97706', background: '#ffffff', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)' }}>
              <div className="stat-number" style={{ color: '#0f172a', fontWeight: 900 }}>{stats.departments}</div>
              <div className="stat-label" style={{ color: '#1e293b', fontWeight: 800 }}>Academic Departments</div>
            </div>
            <div className="card stat-card" style={{ borderTop: '4px solid #059669', background: '#ffffff', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)' }}>
              <div className="stat-number" style={{ color: '#0f172a', fontWeight: 900 }}>{stats.years > 0 ? `${stats.years}+` : 'Full'}</div>
              <div className="stat-label" style={{ color: '#1e293b', fontWeight: 800 }}>Years of Archives</div>
            </div>
            <div className="card stat-card" style={{ borderTop: '4px solid #2563eb', background: '#ffffff', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)' }}>
              <div className="stat-number" style={{ color: '#0f172a', fontWeight: 900 }}>{stats.supervisors > 0 ? `${stats.supervisors}+` : 'Academic'}</div>
              <div className="stat-label" style={{ color: '#1e293b', fontWeight: 800 }}>Faculty Supervisors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Video visible in background, cards are solid white) */}
      <section className="section" id="features-section" style={{ padding: '4rem 0', position: 'relative', zIndex: 5 }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 900, marginBottom: '0.75rem' }}>
              How <span className="text-gradient">GradVault Works</span>
            </h2>
            <p style={{ color: '#1e293b', fontWeight: 700, fontSize: '1.1rem' }}>
              Empowering students and faculty with modern academic research tools
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            
            <div className="card card-body" style={{ textAlign: 'center', background: '#ffffff', border: '2px solid #cbd5e1', boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)' }}>
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: '16px', 
                background: '#dbeafe', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: '#1e3a8a',
                border: '2px solid #93c5fd'
              }}>
                <Search size={30} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 900 }}>
                Bilingual Smart Search
              </h3>
              <p style={{ color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 600 }}>
                Search seamlessly in English or Arabic. Filter by department, academic year, and supervisor name.
              </p>
            </div>

            <div className="card card-body" style={{ textAlign: 'center', background: '#ffffff', border: '2px solid #cbd5e1', boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)' }}>
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: '16px', 
                background: '#fee2e2', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: '#dc2626',
                border: '2px solid #fca5a5'
              }}>
                <GitCompareArrows size={30} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 900 }}>
                AI Originality Analysis
              </h3>
              <p style={{ color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 600 }}>
                Input your proposal abstract. Our AI vector embeddings calculate exact similarity scores against existing projects.
              </p>
            </div>

            <div className="card card-body" style={{ textAlign: 'center', background: '#ffffff', border: '2px solid #cbd5e1', boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)' }}>
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: '16px', 
                background: '#d1fae5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: '#059669',
                border: '2px solid #6ee7b7'
              }}>
                <Award size={30} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 900 }}>
                Official University Archive
              </h3>
              <p style={{ color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 600 }}>
                Official Egyptian Russian University repository for student graduation projects and PDF documentation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="section" id="featured-section" style={{ padding: '4rem 0', position: 'relative', zIndex: 5 }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ color: '#0f172a', fontWeight: 900, fontSize: '2.25rem' }}>Recent <span className="text-gradient">Graduation Projects</span></h2>
              <p style={{ color: '#1e293b', fontWeight: 700, fontSize: '1.05rem' }}>Explore top featured projects from our departments</p>
            </div>
            <div className="projects-grid">
              {featuredProjects.slice(0, 6).map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/search" className="btn btn-secondary btn-lg" id="view-all-btn">
                View All Projects <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
