'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ 
  placeholder = 'Search projects by title, code (e.g. MIS-25/26-2), keywords...', 
  size = 'default',
  onSearch,
  initialValue = '' 
}) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-container" id="search-bar">
      <div style={{ position: 'relative', width: '100%' }}>
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className={`search-input ${size === 'large' ? 'input-lg' : ''}`}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="search-input"
          autoComplete="off"
        />
      </div>
      <button type="submit" className="btn btn-primary search-btn" id="search-submit">
        <Search size={16} />
        Search
      </button>
    </form>
  );
}
