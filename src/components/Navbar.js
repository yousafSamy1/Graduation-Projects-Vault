'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, Search, GitCompareArrows, Shield, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { checkIsAdmin, logoutAdmin } from '@/lib/clientAuth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const verifySession = async () => {
    const valid = await checkIsAdmin();
    setIsAdmin(valid);
  };

  useEffect(() => {
    verifySession();

    const handleAuthChange = () => {
      verifySession();
    };

    window.addEventListener('admin_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('admin_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [pathname]);

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    setIsOpen(false);
    if (pathname.startsWith('/admin/dashboard')) {
      router.push('/admin');
    } else {
      router.refresh();
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search Projects', icon: Search },
    { href: '/compare', label: 'Compare Idea', icon: GitCompareArrows },
  ];

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: '#ffffff',
            padding: '3px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '2px solid #dc2626'
          }}>
            <img 
              src="/logo.png" 
              alt="ERU Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, fontFamily: 'Inter, sans-serif' }}>
              Egyptian Russian University
            </span>
            <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
              Faculty of Management, Economics & Business Technology
            </span>
            <span style={{ fontSize: '10.5px', color: '#1e3a8a', fontWeight: 800, fontFamily: 'Inter, sans-serif', marginTop: '1px' }}>
              Business Technology Department
            </span>
          </div>
        </Link>

        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`navbar-link ${pathname === href ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          {/* Admin link or Dashboard + Logout */}
          {isAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link
                href="/admin/dashboard"
                className={`navbar-link ${pathname.startsWith('/admin/dashboard') ? 'active' : ''}`}
                style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '0.6rem',
                  padding: '0.4rem 0.75rem',
                  fontWeight: 800,
                }}
                onClick={() => setIsOpen(false)}
              >
                <ShieldCheck size={16} color="#2563eb" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-sm"
                style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: '1.5px solid #fca5a5',
                  borderRadius: '0.6rem',
                  padding: '0.4rem 0.75rem',
                  cursor: 'pointer',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.85rem'
                }}
                title="Log out of Admin mode"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/admin"
              className={`navbar-link ${pathname === '/admin' ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Shield size={16} />
              Admin
            </Link>
          )}
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
