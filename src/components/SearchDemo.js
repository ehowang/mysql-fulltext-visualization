import React, { useState } from 'react';
import './SearchDemo.css';

const SearchDemo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('natural');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('');
  
  // Sample document collection for the demo
  const sampleDocuments = [
    { 
      id: 1, 
      title: "Introduction to MySQL Full-Text Search",
      content: "Full-text search allows users to search for documents containing specific words or phrases. It is a fundamental technology used in MySQL search engines."
    },
    { 
      id: 2, 
      title: "Indexing Strategies in MySQL",
      content: "Effective indexing is critical for search performance. MySQL's inverted indices map terms to the documents that contain them."
    },
    { 
      id: 3, 
      title: "Search Optimization Techniques in MySQL",
      content: "Various techniques can improve search quality in MySQL, including proper indexing, optimization, and understanding relevance ranking algorithms."
    },
    { 
      id: 4, 
      title: "Building a MySQL Search Engine",
      content: "A basic search engine includes components for crawling, indexing, and query processing. MySQL provides tools for implementing each component effectively."
    },
    { 
      id: 5, 
      title: "MySQL Full-Text Search vs. LIKE Queries",
      content: "LIKE queries are simple but inefficient for text searching. Full-text search in MySQL is designed specifically for text search needs and performs much better at scale."
    },
    { 
      id: 6, 
      title: "Natural Language Processing with MySQL",
      content: "NLP techniques help MySQL search engines understand queries better. This includes handling synonyms, understanding intent, and processing complex queries."
    },
    { 
      id: 7, 
      title: "Boolean Search Mode in MySQL",
      content: "MySQL's boolean search mode provides precise control over search terms with special operators like +, -, and * for required words, excluded words, and wildcards."
    },
    { 
      id: 8, 
      title: "Query Expansion in MySQL",
      content: "Query expansion broadens search results by adding related terms from top matching documents, finding relevant content even when exact terms aren't present."
    }
  ];
  
  // Common stopwords
  const stopwords = new Set(['a', 'about', 'an', 'are', 'as', 'at', 'be', 'by', 'com', 'de', 'en', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'la', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'und', 'the', 'www']);
  
  // Minimum word length
  const minWordLength = 3;
  
  // Handle search query change
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search mode change
  const handleModeChange = (e) => {
    setSearchMode(e.target.value);
  };
  
  // Perform search when form is submitted
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setSqlQuery('');
      return;
    }
    
    // Generate SQL query that would be used
    let query = `SELECT * FROM documents\nWHERE MATCH(title, content) AGAINST(`;
    
    switch (searchMode) {
      case 'boolean':
        query += `'${searchQuery}' IN BOOLEAN MODE);`;
        break;
      case 'expansion':
        query += `'${searchQuery}' WITH QUERY EXPANSION);`;
        break;
      default: // natural
        query += `'${searchQuery}');`;
    }
    
    setSqlQuery(query);
    
    // Perform search based on mode
    let results = [];
    
    if (searchMode === 'natural') {
      results = performNaturalSearch(searchQuery);
    } else if (searchMode === 'boolean') {
      results = performBooleanSearch(searchQuery);
    } else if (searchMode === 'expansion') {
      results = performQueryExpansion(searchQuery);
    }
    
    setSearchResults(results);
    setHasSearched(true);
  };
  
  // Natural language search implementation
  const performNaturalSearch = (query) => {
    const normalizedQuery = query.toLowerCase();
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => 
      term.length >= minWordLength && !stopwords.has(term)
    );
    
    if (queryTerms.length === 0) return [];
    
    return sampleDocuments.map(doc => {
      // Calculate a relevance score based on term frequency
      const text = (doc.title + " " + doc.content).toLowerCase();
      const words = text.split(/\s+/);
      
      let termMatches = 0;
      queryTerms.forEach(term => {
        words.forEach(word => {
          if (word.includes(term)) {
            termMatches++;
          }
        });
      });
      
      const score = termMatches > 0 ? (termMatches / words.length) * 100 : 0;
      
      // Only return results with at least one match and score > 0
      return {
        ...doc,
        score: score.toFixed(2),
        matches: termMatches
      };
    }).filter(result => result.matches > 0)
      .sort((a, b) => b.score - a.score);
  };
  
  // Boolean search implementation (simplified)
  const performBooleanSearch = (query) => {
    // Parse boolean operators
    const terms = [];
    const requiredTerms = [];
    const excludedTerms = [];
    
    // Simple parsing of + and - operators
    query.split(/\s+/).forEach(term => {
      if (term.startsWith('+')) {
        const cleanTerm = term.substring(1).toLowerCase();
        if (cleanTerm.length >= minWordLength) {
          requiredTerms.push(cleanTerm);
        }
      } else if (term.startsWith('-')) {
        const cleanTerm = term.substring(1).toLowerCase();
        if (cleanTerm.length >= minWordLength) {
          excludedTerms.push(cleanTerm);
        }
      } else {
        const cleanTerm = term.toLowerCase();
        if (cleanTerm.length >= minWordLength && !stopwords.has(cleanTerm)) {
          terms.push(cleanTerm);
        }
      }
    });
    
    return sampleDocuments.filter(doc => {
      const text = (doc.title + " " + doc.content).toLowerCase();
      
      // Check excluded terms (must not contain any)
      for (const term of excludedTerms) {
        if (text.includes(term)) {
          return false;
        }
      }
      
      // Check required terms (must contain all)
      for (const term of requiredTerms) {
        if (!text.includes(term)) {
          return false;
        }
      }
      
      // Check regular terms (should contain at least one if there are any)
      if (terms.length > 0) {
        return terms.some(term => text.includes(term));
      }
      
      return requiredTerms.length > 0; // If we have required terms and no regular terms
    }).map(doc => ({ ...doc, score: 'N/A' }));
  };
  
  // Query expansion implementation (simplified)
  const performQueryExpansion = (query) => {
    // First, perform natural language search
    const firstPassResults = performNaturalSearch(query);
    
    // Get top 2 results
    const topResults = firstPassResults.slice(0, 2);
    
    if (topResults.length === 0) return [];
    
    // Extract significant terms from top results (simplified)
    const expandedTerms = new Set();
    query.toLowerCase().split(/\s+/).forEach(term => {
      if (term.length >= minWordLength && !stopwords.has(term)) {
        expandedTerms.add(term);
      }
    });
    
    // Add terms from top results (simplified approach)
    topResults.forEach(result => {
      const text = (result.title + " " + result.content).toLowerCase();
      const words = text.split(/\s+/);
      
      words.forEach(word => {
        const clean = word.replace(/[^\w]/g, '');
        if (clean.length >= minWordLength && !stopwords.has(clean)) {
          expandedTerms.add(clean);
        }
      });
    });
    
    // Now search with expanded terms
    const expandedQuery = Array.from(expandedTerms).join(' ');
    
    // Perform search with expanded terms
    return performNaturalSearch(expandedQuery);
  };
  
  // Highlight matching terms in the content
  const highlightMatches = (text, query) => {
    if (!query.trim()) return text;
    
    let terms = [];
    
    if (searchMode === 'boolean') {
      // For boolean mode, extract terms without the operators
      terms = query.split(/\s+/).map(term => {
        if (term.startsWith('+') || term.startsWith('-')) {
          return term.substring(1);
        }
        return term;
      });
    } else {
      terms = query.split(/\s+/);
    }
    
    // Filter out stopwords and short terms
    terms = terms.filter(term => 
      term.length >= minWordLength && !stopwords.has(term.toLowerCase())
    );
    
    // Create regex pattern to match all terms
    const pattern = new RegExp(`(${terms.join('|')})`, 'gi');
    
    // Split and rebuild text with highlights
    const parts = text.split(pattern);
    
    return parts.map((part, index) => {
      const isMatch = terms.some(term => 
        part.toLowerCase() === term.toLowerCase()
      );
      
      return isMatch 
        ? <span key={index} className="highlight">{part}</span> 
        : part;
    });
  };
  
  return (
    <div className="search-demo">
      <div className="search-interface">
        <form onSubmit={handleSearch}>
          <div className="search-controls">
            <div className="search-input-container">
              <input
                type="text"
                value={searchQuery}
                onChange={handleQueryChange}
                placeholder="Enter search terms..."
                className="search-input"
              />
              <button type="submit" className="search-button">Search</button>
            </div>
            
            <div className="search-mode-selector">
              <label>
                <input 
                  type="radio" 
                  name="searchMode" 
                  value="natural" 
                  checked={searchMode === 'natural'} 
                  onChange={handleModeChange} 
                />
                Natural Language
              </label>
              <label>
                <input 
                  type="radio" 
                  name="searchMode" 
                  value="boolean" 
                  checked={searchMode === 'boolean'} 
                  onChange={handleModeChange} 
                />
                Boolean Mode
              </label>
              <label>
                <input 
                  type="radio" 
                  name="searchMode" 
                  value="expansion" 
                  checked={searchMode === 'expansion'} 
                  onChange={handleModeChange} 
                />
                Query Expansion
              </label>
            </div>
          </div>
          
          {searchMode === 'boolean' && (
            <div className="boolean-help">
              <p>
                <strong>Boolean Mode Operators:</strong> 
                Use <code>+word</code> (must contain), <code>-word</code> (must not contain), 
                <code>word*</code> (wildcard)
              </p>
            </div>
          )}
        </form>
      </div>
      
      {hasSearched && (
        <div className="search-execution">
          <h3>Equivalent MySQL Query</h3>
          <pre className="sql-query">
            <code>{sqlQuery}</code>
          </pre>
        </div>
      )}
      
      <div className="results-container">
        {hasSearched && (
          <div className="results-summary">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            {searchResults.length > 0 ? ' for ' : ''}
            {searchResults.length > 0 && <span className="query-text">"{searchQuery}"</span>}
          </div>
        )}
        
        {searchResults.length > 0 ? (
          <div className="results-list">
            {searchResults.map(doc => (
              <div key={doc.id} className="result-item">
                <h3 className="result-title">
                  {highlightMatches(doc.title, searchQuery)}
                </h3>
                {searchMode !== 'boolean' && (
                  <div className="result-score">
                    Relevance: {doc.score}
                  </div>
                )}
                <p className="result-content">
                  {highlightMatches(doc.content, searchQuery)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          hasSearched && (
            <div className="no-results">
              <p>No documents found matching your query.</p>
              <p>Try using different keywords or check your spelling.</p>
              {searchMode === 'natural' && (
                <p>Note: Words shorter than {minWordLength} characters and common stopwords are ignored.</p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchDemo;