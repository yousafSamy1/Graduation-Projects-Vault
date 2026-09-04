'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import { Search, Filter, X, Loader, FolderOpen } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/search';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || '');
  const [year, setYear] = useState(searchParams.get('year') || '');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const pageSize = 12;

  const doSearch = useCallback(async (searchQuery, dept, yr, pg) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (dept) params.set('department', dept);
      if (yr) params.set('year', yr);
      params.set('page', pg.toString());
      params.set('pageSize', pageSize.toString());

      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const dept = searchParams.get('department') || '';
    const yr = searchParams.get('year') || '';
    setQuery(q);
    setDepartment(dept);
    setYear(yr);
    doSearch(q, dept, yr, 1);
  }, [searchParams, doSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (department) params.set('department', department);
    if (year) params.set('year', year);
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setQuery('');
    setDepartment('');
    setYear('');
    setPage(1);
    router.push('/search');
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    doSearch(query, department, year, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= currentYear - 10; y--) {
    years.push(y);
  }

  return (
    <>
      <Navbar />

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', position: 'relative', zIndex: 5 }}>
        {/* Page Header */}
        <div className="animate-fade-in-down" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
            Search <span className="text-gradient">Projects</span>
          </h1>
          <p style={{ color: '#1e293b', fontWeight: 700, fontSize: '1.1rem' }}>
            Search through our database of graduation projects
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
          <div className="search-container" style={{ maxWidth: '100%', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by title, abstract, keyword... | ابحث بالعنوان أو الملخص..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                id="search-page-input"
              />
            </div>
            <button type="submit" className="btn btn-primary search-btn btn-sm">
              <Search size={16} />
              Search
            </button>
          </div>

          {/* Filters Bar (Solid White Surface over Video) */}
          <div className="filters-bar" id="search-filters" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            flexWrap: 'wrap',
            background: '#ffffff',
            padding: '1rem 1.25rem',
            borderRadius: '1rem',
            border: '2px solid #cbd5e1',
            boxShadow: '0 4px 15px rgba(15, 23, 42, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>
              <Filter size={16} />
              Filters:
            </div>

            <select
              className="select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{ width: 'auto', minWidth: 180, fontWeight: 700, color: '#0f172a', background: '#ffffff' }}
              id="filter-department"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>

            <select
              className="select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{ width: 'auto', minWidth: 140, fontWeight: 700, color: '#0f172a', background: '#ffffff' }}
              id="filter-year"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {(query || department || year) && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={clearFilters}
                id="clear-filters-btn"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Results Count */}
        {hasSearched && !loading && (
          <div style={{ 
            marginBottom: '1.5rem', 
            fontSize: '1.05rem', 
            fontWeight: 800,
            color: '#0f172a' 
          }}>
            Found <strong style={{ color: '#dc2626' }}>{totalCount}</strong> project{totalCount !== 1 ? 's' : ''}
            {query && <> matching &quot;<strong style={{ color: '#1e3a8a' }}>{query}</strong>&quot;</>}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Loader size={36} style={{ animation: 'spin 1s linear infinite', color: '#1e3a8a' }} />
              <p style={{ color: '#0f172a', fontWeight: 800 }}>Searching projects...</p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && projects.length > 0 && (
          <div className="projects-grid" id="search-results">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Empty State Card (Solid White Surface over Video) */}
        {!loading && hasSearched && projects.length === 0 && (
          <div className="empty-state" style={{ background: '#ffffff', border: '2px solid #cbd5e1', boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)' }}>
            <div className="empty-state-icon">
              <FolderOpen size={48} style={{ color: '#1e3a8a' }} />
            </div>
            <h3 style={{ color: '#0f172a', fontWeight: 900 }}>No projects found</h3>
            <p style={{ color: '#1e293b', fontWeight: 700 }}>Try adjusting your search query or filters to find what you&apos;re looking for.</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="pagination" id="search-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                className={`pagination-btn ${pg === page ? 'active' : ''}`}
                onClick={() => handlePageChange(pg)}
              >
                {pg}
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Loader size={36} style={{ animation: 'spin 1s linear infinite', color: '#1e3a8a' }} />
        </div>
      </>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
