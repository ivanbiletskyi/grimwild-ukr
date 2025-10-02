import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { loadMarkdownContent } from '../utils/markdownLoader';

interface MarkdownRendererProps {
  markdownPath: string;
  title?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownPath, title }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const content = await loadMarkdownContent(markdownPath);
        setMarkdownContent(content);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(`Не вдалося завантажити файл: ${markdownPath}`);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [markdownPath]);

  if (loading) {
    return (
      <div className="markdown-content">
        {title && <h1 className="page-title">{title}</h1>}
        <div className="loading">Завантаження...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="markdown-content">
        {title && <h1 className="page-title">{title}</h1>}
        <div className="error-message" style={{ color: 'var(--danger)', padding: '2rem', textAlign: 'center' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="markdown-content">
      {title && <h1 className="page-title">{title}</h1>}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for markdown elements
          h1: ({ children }) => <h1 style={{ color: 'var(--highlight)' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ color: 'var(--highlight)' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ color: 'var(--highlight)' }}>{children}</h3>,
          h4: ({ children }) => <h4 style={{ color: 'var(--highlight)' }}>{children}</h4>,
          h5: ({ children }) => <h5 style={{ color: 'var(--highlight)' }}>{children}</h5>,
          h6: ({ children }) => <h6 style={{ color: 'var(--highlight)' }}>{children}</h6>,
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '4px solid var(--highlight)',
              paddingLeft: '1rem',
              margin: '1.5rem 0',
              color: 'var(--text-secondary)',
              fontStyle: 'italic'
            }}>
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code style={{
              backgroundColor: 'var(--secondary-bg)',
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontSize: '0.9em',
              fontFamily: 'monospace'
            }}>
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre style={{
              backgroundColor: 'var(--secondary-bg)',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              margin: '1rem 0'
            }}>
              {children}
            </pre>
          ),
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt} 
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
                margin: '1rem 0',
                display: 'block'
              }}
            />
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
