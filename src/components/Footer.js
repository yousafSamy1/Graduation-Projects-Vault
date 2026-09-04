export default function Footer() {
  return (
    <footer 
      className="footer" 
      id="main-footer" 
      style={{ 
        background: '#ffffff', 
        borderTop: '2px solid #cbd5e1', 
        position: 'relative', 
        zIndex: 10,
        boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.04)',
        marginTop: '2.5rem',
        padding: '0.85rem 0'
      }}
    >
      <div className="container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '1rem',
          padding: '0.25rem 0'
        }}>
          {/* Left: Compact Logo & Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#ffffff',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '1.5px solid #dc2626',
              flexShrink: 0
            }}>
              <img src="/logo.png" alt="ERU Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                Egyptian Russian University
              </div>
              <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>
                Faculty of Management & Business Tech
              </div>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="/search" style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>Search Projects</a>
            <a href="/compare" style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>AI Originality Check</a>
            <a href="/admin" style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>Admin Portal</a>
          </div>

          {/* Right: Compact Copyright */}
          <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
            © {new Date().getFullYear()} ERU. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
