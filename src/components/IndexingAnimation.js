import React, { useEffect, useRef } from 'react';
import './IndexingAnimation.css';

const IndexingAnimation = ({ 
  activeStep, 
  setActiveStep, 
  isPlaying, 
  setIsPlaying,
  playbackSpeed,
  totalSteps
}) => {
  const animationTimerRef = useRef(null);
  
  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);
  
  // Handle auto-play animation
  useEffect(() => {
    if (isPlaying) {
      animationTimerRef.current = setTimeout(() => {
        if (activeStep < totalSteps - 1) {
          setActiveStep(activeStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, 2000 / playbackSpeed);
    } else if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }
    
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [isPlaying, activeStep, setActiveStep, setIsPlaying, playbackSpeed, totalSteps]);
  
  // Sample documents for indexing
  const documents = [
    { id: 1, text: "The quick brown fox jumps over the lazy dog" },
    { id: 2, text: "A fox is a wild animal related to dogs and wolves" },
    { id: 3, text: "The dog watched the fox from a distance" }
  ];
  
  // Animation steps content
  const renderAnimationStep = () => {
    switch(activeStep) {
      case 0:
        return <DocumentCollection documents={documents} />;
      case 1:
        return <Tokenization documents={documents} />;
      case 2:
        return <StopwordFiltering documents={documents} />;
      case 3:
        return <NormalizationStep documents={documents} />;
      case 4:
        return <InvertedIndexCreation documents={documents} />;
      case 5:
        return <MySQLTables documents={documents} />;
      case 6:
        return <SearchQuery documents={documents} searchTerm="fox" />;
      case 7:
        return <SearchResults documents={documents} searchTerm="fox" />;
      default:
        return <div>Something went wrong</div>;
    }
  };
  
  return (
    <div className="animation-container">
      <div className="step-indicator">
        Step {activeStep + 1} of {totalSteps}
      </div>
      {renderAnimationStep()}
    </div>
  );
};

// Component to show the initial document collection
const DocumentCollection = ({ documents }) => {
  return (
    <div className="animation-step document-collection">
      <h3>Document Collection</h3>
      <div className="mysql-note">
        <div className="note-icon">📝</div>
        <div className="note-content">
          MySQL full-text indexing supports CHAR, VARCHAR, and TEXT columns.
        </div>
      </div>
      <div className="documents">
        {documents.map(doc => (
          <div key={doc.id} className="document">
            <div className="doc-id">Document {doc.id} (DOC_ID in MySQL)</div>
            <div className="doc-content">{doc.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to show the tokenization process
const Tokenization = ({ documents }) => {
  return (
    <div className="animation-step tokenization">
      <h3>Tokenization</h3>
      <div className="mysql-note">
        <div className="note-icon">📝</div>
        <div className="note-content">
          MySQL breaks text into words based on space and punctuation characters.
        </div>
      </div>
      <div className="documents">
        {documents.map(doc => (
          <div key={doc.id} className="document tokenized">
            <div className="doc-id">Document {doc.id}</div>
            <div className="tokens">
              {doc.text.split(' ').map((token, idx) => (
                <span key={idx} className="token">{token}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to show stopword filtering process
const StopwordFiltering = ({ documents }) => {
  // Common stopwords in English
  const stopwords = new Set(['the', 'a', 'is', 'over', 'from']);
  
  return (
    <div className="animation-step stopword-filtering">
      <h3>Stopword Filtering</h3>
      <div className="mysql-note">
        <div className="note-icon">📝</div>
        <div className="note-content">
          MySQL has built-in stopword lists for both InnoDB and MyISAM. These can be customized.
        </div>
      </div>
      <div className="documents">
        {documents.map(doc => (
          <div key={doc.id} className="document filtered">
            <div className="doc-id">Document {doc.id}</div>
            <div className="tokens">
              {doc.text.split(' ').map((token, idx) => {
                const cleanToken = token.toLowerCase().replace(/[^\w\s]/g, '');
                const isStopword = stopwords.has(cleanToken);
                
                return (
                  <span key={idx} className={`token ${isStopword ? 'stopword' : ''}`}>
                    {token}
                    {isStopword && <span className="stopword-badge">stopword</span>}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to show the normalization process
const NormalizationStep = ({ documents }) => {
  // Simulate normalization (lowercase, remove punctuation)
  const normalizeToken = (token) => {
    return token.toLowerCase().replace(/[^\w\s]/g, '');
  };
  
  // Common stopwords in English
  const stopwords = new Set(['the', 'a', 'is', 'over', 'from']);
  
  return (
    <div className="animation-step normalization">
      <h3>Normalization</h3>
      <div className="mysql-note">
        <div className="note-icon">📝</div>
        <div className="note-content">
          MySQL normalizes tokens by converting to lowercase and removing punctuation.
          Words shorter than the minimum length (3 for InnoDB, 4 for MyISAM) are ignored.
        </div>
      </div>
      <div className="documents">
        {documents.map(doc => (
          <div key={doc.id} className="document normalized">
            <div className="doc-id">Document {doc.id}</div>
            <div className="tokens">
              {doc.text.split(' ').map((token, idx) => {
                const normalizedToken = normalizeToken(token);
                const isStopword = stopwords.has(normalizedToken);
                const isTooShort = normalizedToken.length < 3;
                
                return (
                  <div key={idx} className="token-normalized">
                    <div className="original">{token}</div>
                    <div className="arrow">↓</div>
                    <div className={`normalized ${isStopword ? 'strikethrough' : ''} ${isTooShort ? 'strikethrough' : ''}`}>
                      {normalizedToken}
                      {isStopword && <span className="filter-reason">stopword</span>}
                      {!isStopword && isTooShort && <span className="filter-reason">too short</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to show the inverted index creation
const InvertedIndexCreation = ({ documents }) => {
  // Common stopwords in English
  const stopwords = new Set(['the', 'a', 'is', 'over', 'from']);
  
  // Create an inverted index from the documents
  const createInvertedIndex = () => {
    const index = {};
    
    documents.forEach(doc => {
      const tokens = doc.text.toLowerCase().split(' ');
      
      tokens.forEach((token, position) => {
        // Remove punctuation
        const cleanToken = token.replace(/[^\w\s]/g, '');
        
        // Skip stopwords and short words
        if (stopwords.has(cleanToken) || cleanToken.length < 3) {
          return;
        }
        
        if (!index[cleanToken]) {
          index[cleanToken] = [];
        }
        
        // Store document ID and position
        index[cleanToken].push({
          docId: doc.id,
          position: position
        });
      });
    });
    
    return index;
  };
  
  const invertedIndex = createInvertedIndex();
  
  return (
    <div className="animation-step inverted-index">
      <h3>Inverted Index Creation</h3>
      <div className="mysql-note">
        <div className="note-icon">📝</div>
        <div className="note-content">
          The inverted index is the core of MySQL full-text search. It maps words to documents and positions.
        </div>
      </div>
      <div className="index-visualization">
        <div className="term-header">Term</div>
        <div className="posting-list-header">Document IDs & Positions</div>
        
        {Object.keys(invertedIndex).sort().map(term => (
          <div key={term} className="index-entry">
            <div className="term">{term}</div>
            <div className="posting-list">
              {invertedIndex[term].map((entry, idx) => (
                <span key={idx} className="doc-ref">
                  Doc {entry.docId} (pos {entry.position})
                  {idx < invertedIndex[term].length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to show MySQL's internal tables for full-text indexing
const MySQLTables = () => {
  return (
    <div className="animation-step mysql-tables">
      <h3>MySQL Internal Tables (InnoDB)</h3>
      <div className="mysql-note">
        <div className="note-icon">📝</div>
        <div className="note-content">
          InnoDB implements full-text indexing using 6 auxiliary tables plus 3 common tables.
          MyISAM's implementation differs but serves the same purpose.
        </div>
      </div>
      
      <div className="innodb-tables">
        <div className="auxiliary-tables">
          <h4>Auxiliary Index Tables (6 tables)</h4>
          <div className="table-group">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="db-table">
                <div className="table-header">Auxiliary Table {i}</div>
                <div className="table-body">
                  <div className="table-row header">
                    <div className="table-cell">word</div>
                    <div className="table-cell">doc_id</div>
                    <div className="table-cell">position</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">fox</div>
                    <div className="table-cell">1</div>
                    <div className="table-cell">3</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">brown</div>
                    <div className="table-cell">1</div>
                    <div className="table-cell">2</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">...</div>
                    <div className="table-cell">...</div>
                    <div className="table-cell">...</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="common-tables">
          <h4>Common Index Tables</h4>
          <div className="db-table">
            <div className="table-header">fts_*_deleted</div>
            <div className="table-body">
              <div className="table-row header">
                <div className="table-cell">doc_id</div>
              </div>
              <div className="table-row">
                <div className="table-cell">4</div>
              </div>
            </div>
          </div>
          
          <div className="db-table">
            <div className="table-header">fts_*_being_deleted</div>
            <div className="table-body">
              <div className="table-row header">
                <div className="table-cell">doc_id</div>
              </div>
              <div className="table-row">
                <div className="table-cell">5</div>
              </div>
            </div>
          </div>
          
          <div className="db-table">
            <div className="table-header">fts_*_config</div>
            <div className="table-body">
              <div className="table-row header">
                <div className="table-cell">key</div>
                <div className="table-cell">value</div>
              </div>
              <div className="table-row">
                <div className="table-cell">FTS_SYNCED_DOC_ID</div>
                <div className="table-cell">3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to show a search query being processed
const SearchQuery = ({ documents, searchTerm }) => {
  // Common stopwords in English
  const stopwords = new Set(['the', 'a', 'is', 'over', 'from']);
  
  // Create an inverted index from the documents
  const createInvertedIndex = () => {
    const index = {};
    
    documents.forEach(doc => {
      const tokens = doc.text.toLowerCase().split(' ');
      
      tokens.forEach((token, position) => {
        // Remove punctuation
        const cleanToken = token.replace(/[^\w\s]/g, '');
        
        // Skip stopwords and short words
        if (stopwords.has(cleanToken) || cleanToken.length < 3) {
          return;
        }
        
        if (!index[cleanToken]) {
          index[cleanToken] = [];
        }
        
        // Store document ID and position
        index[cleanToken].push({
          docId: doc.id,
          position: position
        });
      });
    });
    
    return index;
  };
  
  const invertedIndex = createInvertedIndex();
  const lowercaseSearchTerm = searchTerm.toLowerCase();
  
  return (
    <div className="animation-step search-query">
      <h3>Search Query: "{searchTerm}"</h3>
      <div className="mysql-note">
        <div className="note-icon">📝</div>
        <div className="note-content">
          MySQL uses MATCH() AGAINST() syntax for full-text search.
          Example: SELECT * FROM articles WHERE MATCH(title, body) AGAINST('fox');
        </div>
      </div>
      
      <div className="query-process">
        <div className="query-normalization">
          <div className="original-query">{searchTerm}</div>
          <div className="arrow">↓ Normalize</div>
          <div className="normalized-query">{lowercaseSearchTerm}</div>
        </div>
        
        <div className="index-lookup">
          <div className="lookup-title">Looking up in the inverted index:</div>
          <div className="index-entries">
            {Object.keys(invertedIndex).map(term => (
              <div 
                key={term} 
                className={`index-entry ${term === lowercaseSearchTerm ? 'highlight' : ''}`}
              >
                <div className="term">{term}</div>
                <div className="posting-list">
                  {invertedIndex[term].map((entry, idx) => (
                    <span key={idx} className="doc-ref">
                      Doc {entry.docId} (pos {entry.position})
                      {idx < invertedIndex[term].length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to show search results
const SearchResults = ({ documents, searchTerm }) => {
  // Common stopwords in English
  const stopwords = new Set(['the', 'a', 'is', 'over', 'from']);
  
  // Perform search and get results
  const performSearch = (term) => {
    const normalizedTerm = term.toLowerCase();
    
    const results = documents.filter(doc => 
      doc.text.toLowerCase().includes(normalizedTerm)
    ).map(doc => {
      // Calculate a simple relevance score based on term frequency
      const text = doc.text.toLowerCase();
      const words = text.split(/\s+/);
      const termCount = words.filter(word => word.includes(normalizedTerm)).length;
      const score = (termCount / words.length) * 100;
      
      return {
        ...doc,
        score: score.toFixed(2)
      };
    });
    
    // Sort by score (descending)
    return results.sort((a, b) => b.score - a.score);
  };
  
  const results = performSearch(searchTerm);
  
  return (
    <div className="animation-step search-results">
      <h3>Search Results for: "{searchTerm}"</h3>
      <div className="mysql-note">
        <div className="note-icon">📝</div>
        <div className="note-content">
          MySQL calculates relevance scores for natural language searches and 
          automatically sorts results by relevance (when not using ORDER BY).
        </div>
      </div>
      
      <div className="results-count">
        Found {results.length} document{results.length !== 1 ? 's' : ''}
      </div>
      
      <div className="results-list">
        {results.map(doc => (
          <div key={doc.id} className="result-item">
            <div className="result-header">
              <div className="doc-id">Document {doc.id}</div>
              <div className="relevance-score">Relevance: {doc.score}%</div>
            </div>
            <div className="doc-content">
              {doc.text.split(new RegExp(`(${searchTerm})`, 'i')).map((part, idx) => 
                part.toLowerCase() === searchTerm.toLowerCase() 
                  ? <span key={idx} className="highlight">{part}</span> 
                  : <span key={idx}>{part}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexingAnimation;
