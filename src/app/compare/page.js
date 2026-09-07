'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SimilarityResult from '@/components/SimilarityResult';
import Footer from '@/components/Footer';
import { GitCompareArrows, Loader, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ComparePage() {
  const [abstractText, setAbstractText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasCompared, setHasCompared] = useState(false);

  const handleCompare = async () => {
    if (!abstractText.trim()) {
      setError('Please provide an abstract or project idea text.');
      return;
    }

    setError('');
    setLoading(true);
    setHasCompared(true);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: abstractText.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Comparison failed');
      }

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const maxSimilarity = results.length > 0 ? Math.max(...results.map(r => r.similarity)) : 0;
  const maxPercentage = Math.round(maxSimilarity * 100);

  return (
    <>
      <Navbar />

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: 850 }}>
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
          <div className="animate-fade-in-down" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 18px',
              background: '#fef3c7',
              border: '2px solid #fcd34d',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              color: '#92400e',
              marginBottom: '1rem',
              fontWeight: 800
            }}>
              <Sparkles size={16} />
              AI-Powered Analysis
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem' }}>
              Compare Your <span className="text-gradient">Idea</span>
            </h1>
            <p style={{ color: '#1e293b', fontWeight: 700, maxWidth: 540, margin: '0 auto', fontSize: '1.05rem' }}>
              Paste your abstract or project idea to check if a similar project already exists in our database.
            </p>
          </div>

          {/* Input Section (Text Only) */}
          <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
            <div className="input-group">
              <label htmlFor="abstract-textarea" style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'block' }}>
                Your Abstract / Project Idea (ملخص الفكرة أو المشروع)
              </label>
              <textarea
                className="textarea"
                placeholder="Paste your project abstract here... (Arabic or English)&#10;&#10;اكتب ملخص فكرة مشروعك هنا باللغة العربية أو الإنجليزية..."
                value={abstractText}
                onChange={(e) => setAbstractText(e.target.value)}
                style={{ minHeight: 180, fontSize: '0.98rem' }}
                id="abstract-textarea"
              />
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', fontWeight: 700 }}>
                {abstractText.length} characters
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ 
              padding: '1rem', 
              background: '#fee2e2', 
              borderRadius: '0.75rem',
              color: '#991b1b',
              fontSize: '0.9rem',
              fontWeight: 800,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '2px solid #fca5a5'
            }}>
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          {/* Compare Button */}
          <button
            className="btn btn-accent btn-lg"
            onClick={handleCompare}
            disabled={loading || !abstractText.trim()}
            style={{ width: '100%', marginBottom: '2.5rem' }}
            id="compare-btn"
          >
            {loading ? (
              <>
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Analyzing with AI...
              </>
            ) : (
              <>
                <GitCompareArrows size={18} />
                Compare with Database
              </>
            )}
          </button>

          {/* Results */}
          {hasCompared && !loading && (
            <div className="animate-fade-in-up">
              {/* Summary */}
              {results.length > 0 && (
                <div className="card card-body" style={{ 
                  marginBottom: '1.5rem',
                  borderWidth: '2px',
                  borderColor: maxPercentage >= 70 ? '#ef4444' : maxPercentage >= 30 ? '#f59e0b' : '#10b981',
                  background: '#ffffff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {maxPercentage >= 70 ? (
                      <AlertTriangle size={32} style={{ color: '#dc2626' }} />
                    ) : (
                      <CheckCircle size={32} style={{ color: '#059669' }} />
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>
                        {maxPercentage >= 70 
                          ? 'High Similarity Found!' 
                          : maxPercentage >= 30 
                          ? 'Some Similar Projects Found'
                          : 'Your Idea Looks Unique!'
                        }
                      </h3>
                      <p style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 700 }}>
                        Found {results.length} similar project{results.length !== 1 ? 's' : ''}. 
                        Maximum similarity: <strong style={{ color: '#dc2626' }}>{maxPercentage}%</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Results List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {results.map((result) => (
                  <SimilarityResult
                    key={result.id}
                    project={result}
                    similarity={result.similarity}
                  />
                ))}
              </div>

              {/* No results */}
              {results.length === 0 && (
                <div className="empty-state" style={{ background: '#f8fafc', border: '2px solid #cbd5e1' }}>
                  <div className="empty-state-icon">
                    <CheckCircle size={48} style={{ color: '#059669' }} />
                  </div>
                  <h3 style={{ color: '#0f172a', fontWeight: 900 }}>No Similar Projects Found!</h3>
                  <p style={{ color: '#1e293b', fontWeight: 700 }}>Your idea appears to be unique. No similar projects were found in our database.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
