'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept = '.pdf', maxSize = 10 }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const maxBytes = maxSize * 1024 * 1024;

  const handleFile = (selectedFile) => {
    setError('');

    if (!selectedFile) return;

    if (selectedFile.size > maxBytes) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    if (accept === '.pdf' && selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setFile(selectedFile);
    if (onFileSelect) onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div id="file-upload-zone">
      {!file ? (
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <div className="upload-zone-icon">
            <Upload size={28} />
          </div>
          <p className="upload-zone-text">
            Drag & drop your PDF here, or <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>browse</span>
          </p>
          <p className="upload-zone-hint">
            PDF files up to {maxSize}MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={(e) => handleFile(e.target.files[0])}
            style={{ display: 'none' }}
            id="file-input"
          />
        </div>
      ) : (
        <div className="card" style={{ padding: 'var(--space-4) var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <FileText size={24} style={{ color: 'var(--primary-400)' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{file.name}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              className="btn btn-ghost btn-icon"
              onClick={removeFile}
              type="button"
              id="remove-file-btn"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
