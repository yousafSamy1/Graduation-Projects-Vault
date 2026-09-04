'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, Search, GitCompareArrows, Shield, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search Projects', icon: Search },
  { href: '/compare', label: 'Compare Idea', icon: GitCompareArrows },
  { href: '/admin', label: 'Admin', icon: Shield },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
