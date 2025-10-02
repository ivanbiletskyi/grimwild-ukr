import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { loadMarkdownContent } from '../utils/markdownLoader';
import { useLocation } from 'react-router-dom';

interface MarkdownRendererProps {
  markdownPath: string;
  title?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownPath, title }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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

  // Handle scroll to search result
  useEffect(() => {
    if (!loading && markdownContent && contentRef.current) {
      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.get('search');
      const contextParam = searchParams.get('context');
      
      if (searchQuery) {
        // Wait for the DOM to be fully rendered
        setTimeout(() => {
          const contentElement = contentRef.current;
          if (!contentElement) return;

          // Get all text content for matching
          const allTextNodes = getTextNodes(contentElement);
          const lowerQuery = searchQuery.toLowerCase();
          
          // If we have context, use it to find the exact occurrence
          if (contextParam) {
            const normalizedContext = normalizeText(contextParam);
            
            // Try to find the specific occurrence using context
            for (const node of allTextNodes) {
              const element = node.parentElement;
              if (!element) continue;
              
              // Get surrounding context from the DOM
              const surroundingText = getSurroundingText(node, 100);
              const normalizedSurrounding = normalizeText(surroundingText);
              
              // Check if this occurrence matches the context
              if (normalizedSurrounding.includes(normalizedContext) || 
                  normalizedContext.includes(normalizedSurrounding)) {
                const text = node.textContent || '';
                if (text.toLowerCase().includes(lowerQuery)) {
                  highlightSearchText(element, searchQuery);
                  scrollToElement(element);
                  return;
                }
              }
            }
          }
          
          // Fallback: find first occurrence if context matching fails
          for (const node of allTextNodes) {
            const text = node.textContent || '';
            if (text.toLowerCase().includes(lowerQuery)) {
              const element = node.parentElement;
              if (element) {
                highlightSearchText(element, searchQuery);
                scrollToElement(element);
                break;
              }
            }
          }
        }, 100);
      }
    }
  }, [loading, markdownContent, location.search]);

  // Helper function to normalize text for comparison
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[.,!?;:()]/g, '') // Remove punctuation
      .trim();
  };

  // Helper function to get surrounding text from a node
  const getSurroundingText = (node: Node, contextLength: number): string => {
    const element = node.parentElement;
    if (!element) return node.textContent || '';
    
    // Get text from parent and nearby siblings
    let text = '';
    
    // Get previous siblings
    let prevSibling = element.previousElementSibling;
    let prevText = '';
    while (prevSibling && prevText.length < contextLength / 2) {
      prevText = (prevSibling.textContent || '') + ' ' + prevText;
      prevSibling = prevSibling.previousElementSibling;
    }
    
    // Current element
    const currentText = element.textContent || '';
    
    // Get next siblings
    let nextSibling = element.nextElementSibling;
    let nextText = '';
    while (nextSibling && nextText.length < contextLength / 2) {
      nextText = nextText + ' ' + (nextSibling.textContent || '');
      nextSibling = nextSibling.nextElementSibling;
    }
    
    text = prevText + ' ' + currentText + ' ' + nextText;
    return text.trim();
  };

  // Helper function to scroll to element
  const scrollToElement = (element: HTMLElement) => {
    const yOffset = -100; // Adjust for sticky navigation
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Helper function to get all text nodes
  const getTextNodes = (element: HTMLElement): Node[] => {
    const textNodes: Node[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent?.trim()) {
        textNodes.push(node);
      }
    }
    return textNodes;
  };

  // Helper function to highlight search text
  const highlightSearchText = (element: HTMLElement, query: string) => {
    const innerHTML = element.innerHTML;
    const lowerHTML = innerHTML.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerHTML.indexOf(lowerQuery);
    
    if (index !== -1) {
      const before = innerHTML.substring(0, index);
      const match = innerHTML.substring(index, index + query.length);
      const after = innerHTML.substring(index + query.length);
      
      element.innerHTML = `${before}<mark style="background-color: var(--highlight); color: var(--text-primary); padding: 0.2em 0.4em; border-radius: 3px; font-weight: 600;">${match}</mark>${after}`;
    }
  };

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
    <div className="markdown-content" ref={contentRef}>
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
          table: ({ children }) => (
            <div style={{
              overflowX: 'auto',
              margin: '1rem 0',
              borderRadius: '8px',
              backgroundColor: 'var(--secondary-bg)',
              WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
            }}>
              <table style={{
                minWidth: '100%',
                borderCollapse: 'collapse',
                margin: 0,
                backgroundColor: 'transparent'
              }}>
                {children}
              </table>
            </div>
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
