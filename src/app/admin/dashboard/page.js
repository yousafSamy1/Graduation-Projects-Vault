'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Plus, Trash2, LogOut, Search, Loader, FolderOpen, Download, Edit } from 'lucide-react';

const departmentBadgeClass = {
  'MIS': 'badge-mis',
  'BA': 'badge-ba',
  'Fintech': 'badge-fintech',
  'Marketing Intelligence': 'badge-marketing',
};

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?pageSize=100');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setDeleteId(id);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
    setDeleteId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    router.push('/admin');
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.title_en || '').toLowerCase().includes(q) ||
      (p.title_ar || '').toLowerCase().includes(q) ||
      (p.department || '').toLowerCase().includes(q) ||
      (p.supervisor || '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Navbar />

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {/* Solid White Main Panel */}
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
          <div className="admin-header animate-fade-in-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>
                Admin <span className="text-gradient">Dashboard</span>
              </h1>
              <p style={{ color: '#1e293b', fontWeight: 700, fontSize: '1rem' }}>
                Manage graduation projects • <strong style={{ color: '#dc2626' }}>{projects.length}</strong> total projects
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/admin/dashboard/add" className="btn btn-primary" id="add-project-btn">
                <Plus size={16} />
                Add Project
              </Link>
              <button className="btn btn-ghost" onClick={handleLogout} id="logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '1.5rem' }} className="animate-fade-in-up">
            <div className="search-container" style={{ maxWidth: '100%' }}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Search projects by title, department, supervisor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="admin-search"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <Loader size={36} style={{ animation: 'spin 1s linear infinite', color: '#1e3a8a' }} />
            </div>
          )}

          {/* Projects Table */}
          {!loading && filteredProjects.length > 0 && (
            <div className="admin-table-container animate-fade-in-up" id="projects-table" style={{ border: '2px solid #cbd5e1', borderRadius: '0.75rem', overflow: 'hidden' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#0f172a', fontWeight: 800 }}>Title</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#0f172a', fontWeight: 800 }}>Department</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#0f172a', fontWeight: 800 }}>Year</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#0f172a', fontWeight: 800 }}>Supervisor</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#0f172a', fontWeight: 800 }}>Students</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#0f172a', fontWeight: 800 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}>
                        <Link
                          href={`/project/${project.id}`}
                          style={{ fontWeight: 800, color: '#1e3a8a', textDecoration: 'none' }}
                        >
                          {project.title_en || project.title_ar || 'Untitled'}
                        </Link>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${departmentBadgeClass[project.department] || 'badge-mis'}`}>
                          {project.department}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>{project.year}</td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>{project.supervisor || '—'}</td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        {Math.max(project.students?.length || 0, project.students_details?.length || 0)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link
                            href={`/admin/dashboard/edit/${project.id}`}
                            className="btn btn-ghost btn-sm"
                            title="Edit project"
                            id={`edit-${project.id}`}
                            style={{ color: '#1e3a8a' }}
                          >
                            <Edit size={14} />
                          </Link>
                          {project.pdf_url && (
                            <a
                              href={project.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-ghost btn-sm"
                              title="Download PDF"
                            >
                              <Download size={14} />
                            </a>
                          )}
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDelete(project.id)}
                            disabled={deleteId === project.id}
                            title="Delete project"
                            id={`delete-${project.id}`}
                            style={{ color: '#dc2626' }}
                          >
                            {deleteId === project.id ? (
                              <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProjects.length === 0 && (
            <div className="empty-state" style={{ background: '#f8fafc', border: '2px solid #cbd5e1' }}>
              <div className="empty-state-icon">
                <FolderOpen size={48} style={{ color: '#1e3a8a' }} />
              </div>
              <h3 style={{ color: '#0f172a', fontWeight: 900 }}>No projects yet</h3>
              <p style={{ color: '#1e293b', fontWeight: 700 }}>Start by adding your first graduation project to the database.</p>
              <Link href="/admin/dashboard/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                <Plus size={16} />
                Add First Project
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
