import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { searchDocumentation, type SearchResult } from '../utils/searchUtils';
import './Search.css';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const searchResults = await searchDocumentation(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index} className="search-highlight">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  // Safe encode URI component
  const safeEncodeURIComponent = (str: string): string => {
    try {
      // Clean the string first - remove any null bytes or other problematic characters
      // eslint-disable-next-line no-control-regex
      const cleaned = str.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      return encodeURIComponent(cleaned);
    } catch (error) {
      console.error('Error encoding URI component:', error);
      // Return empty string if encoding fails
      return '';
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>🔍 Пошук по документації</h1>
        <p className="search-description">
          Знайдіть правила, класи, механіки та інше
        </p>
      </div>

      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Введіть запит для пошуку..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => {
              setQuery('');
              setResults([]);
              setHasSearched(false);
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {loading && (
        <div className="search-loading">
          <div className="search-spinner"></div>
          <p>Пошук...</p>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className="search-no-results">
          <p>😔 Нічого не знайдено за запитом "{query}"</p>
          <p className="search-tip">Спробуйте інші ключові слова або перевірте правопис</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="search-results">
          <p className="search-results-count">
            Знайдено результатів: <strong>{results.length}</strong>
          </p>
          <div className="search-results-list">
            {results.map((result, index) => {
              const searchParam = safeEncodeURIComponent(query);
              const contextParam = safeEncodeURIComponent(result.context || '');
              return (
                <Link
                  key={`${result.path}-${index}`}
                  to={`${result.path}?search=${searchParam}&context=${contextParam}`}
                  className="search-result-card"
                >
                  <h3 className="search-result-title">
                    {highlightText(result.title, query)}
                  </h3>
                  <p className="search-result-excerpt">
                    {highlightText(result.excerpt, query)}
                  </p>
                  <div className="search-result-meta">
                    <span className="search-result-matches">
                      {result.matches} збігів
                    </span>
                    <span className="search-result-path">{result.path}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {!loading && !hasSearched && (
        <div className="search-tips">
          <h3>💡 Поради для пошуку</h3>
          <ul>
            <li>Використовуйте ключові слова, як "клас", "бій", "заклинання"</li>
            <li>Шукайте назви класів: "Бард", "Паладин", "Чародій"</li>
            <li>Вводьте мінімум 2 символи для початку пошуку</li>
            <li>Пошук не чутливий до регістру</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;

