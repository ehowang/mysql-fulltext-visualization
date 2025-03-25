import React, { useState, useEffect, useRef } from 'react';
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
  
  // State for user-defined documents and search query
  const [userDocuments, setUserDocuments] = useState([
    { id: 1, text: "The quick brown fox jumps over the lazy dog" },
    { id: 2, text: "A fox is a wild animal related to dogs and wolves" },
    { id: 3, text: "The dog watched the fox from a distance" }
  ]);
  const [searchQuery, setSearchQuery] = useState("fox");
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [newDocText, setNewDocText] = useState("");
  
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
  
  // Handle adding a new document
  const handleAddDocument = (e) => {
    e.preventDefault();
    if (newDocText.trim()) {
      setUserDocuments([
        ...userDocuments, 
        { id: userDocuments.length + 1, text: newDocText }
      ]);
      setNewDocText("");
      setShowDocumentForm(false);
    }
  };
  
  // Handle removing a document
  const handleRemoveDocument = (id) => {
    if (userDocuments.length > 1) { // Ensure at least one document remains
      const updatedDocs = userDocuments.filter(doc => doc.id !== id);
      // Reassign IDs to maintain sequence
      const reindexedDocs = updatedDocs.map((doc, index) => ({
        ...doc,
        id: index + 1
      }));
      setUserDocuments(reindexedDocs);
    }
  };
  
  // Handle editing a document
  const handleEditDocument = (id, newText) => {
    const updatedDocs = userDocuments.map(doc => 
      doc.id === id ? { ...doc, text: newText } : doc
    );
    setUserDocuments(updatedDocs);
  };
  
  // Reset animation when changing documents or query
  useEffect(() => {
    if (activeStep > 0) {
      setActiveStep(0);
      setIsPlaying(false);
    }
  }, [userDocuments, searchQuery, setActiveStep, setIsPlaying]);
  
  // Animation steps content
  const renderAnimationStep = () => {
    switch(activeStep) {
      case 0:
        return <DocumentCollection 
                 documents={userDocuments}
                 onAddDocument={() => setShowDocumentForm(true)}
                 showForm={showDocumentForm}
                 newDocText={newDocText}
                 setNewDocText={setNewDocText}
                 handleAddDocument={handleAddDocument}
                 handleRemoveDocument={handleRemoveDocument}
                 handleEditDocument={handleEditDocument}
                 setSearchQuery={setSearchQuery}
                 searchQuery={searchQuery}
                 setShowDocumentForm={setShowDocumentForm}
               />;
      case 1:
        return <Tokenization documents={userDocuments} />;
      case 2:
        return <StopwordFiltering documents={userDocuments} />;
      case 3:
        return <NormalizationStep documents={userDocuments} />;
      case 4:
        return <InvertedIndexCreation documents={userDocuments} />;
      case 5:
        return <MySQLTables documents={userDocuments} />;
      case 6:
        return <SearchQuery documents={userDocuments} searchTerm={searchQuery} />;
      case 7:
        return <SearchResults documents={userDocuments} searchTerm={searchQuery} />;
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
const DocumentCollection = ({ 
  documents, 
  onAddDocument, 
  showForm, 
  newDocText, 
  setNewDocText, 
  handleAddDocument,
  handleRemoveDocument,
  handleEditDocument,
  setSearchQuery,
  searchQuery,
  setShowDocumentForm
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      handleEditDocument(editingId, editText);
    }
    setEditingId(null);
  };
  
  return (
    <div className="animation-step document-collection">
      <h3>Document Collection</h3>
      <div className="mysql-note">
        <div className="note-icon">📝</div>
        <div className="note-content">
          MySQL full-text indexing supports CHAR, VARCHAR, and TEXT columns.
        </div>
      </div>
      
      <div className="action-panel">
        <div className="search-query-input">
          <label htmlFor="search-query">Search Query:</label>
          <input
            type="text"
            id="search-query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search terms..."
          />
          <div className="input-note">
            This query will be used in the search steps (6-7)
          </div>
        </div>
        
        <button className="add-document-btn" onClick={onAddDocument}>
          Add New Document
        </button>
      </div>
      
      {showForm && (
        <div className="document-form">
          <form onSubmit={handleAddDocument}>
            <textarea
              value={newDocText}
              onChange={(e) => setNewDocText(e.target.value)}
              placeholder="Enter document text..."
              required
            />
            <div className="form-actions">
              <button type="submit">Add Document</button>
              <button type="button" onClick={() => setNewDocText("")}>Clear</button>
              <button type="button" onClick={() => setShowDocumentForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      <div className="documents">
        {documents.map(doc => (
          <div key={doc.id} className="document">
            <div className="document-header">
              <div className="doc-id">Document {doc.id} (DOC_ID in MySQL)</div>
              <div className="document-actions">
                <button className="edit-btn" onClick={() => startEditing(doc.id, doc.text)}>
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleRemoveDocument(doc.id)}
                  disabled={documents.length <= 1}
                >
                  Delete
                </button>
              </div>
            </div>
            
            {editingId === doc.id ? (
              <div className="edit-document">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="edit-actions">
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="doc-content">{doc.text}</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="documents-note">
        <strong>Note:</strong> You can add, edit, or remove documents in this step.
        Changes will flow through all subsequent animation steps.
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
  const stopwords = new Set(['a', 'about', 'an', 'are', 'as', 'at', 'be', 'by', 'com', 'de', 'en', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'la', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'und', 'the', 'www']);
  
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
  const stopwords = new Set(['a', 'about', 'an', 'are', 'as', 'at', 'be', 'by', 'com', 'de', 'en', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'la', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'und', 'the', 'www']);
  
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
  const stopwords = new Set( ['a', 'about', 'an', 'are', 'as', 'at', 'be', 'by', 'com', 'de', 'en', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'la', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'und', 'the', 'www']);
  
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
  const stopwords = new Set(['a', 'about', 'an', 'are', 'as', 'at', 'be', 'by', 'com', 'de', 'en', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'la', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'und', 'the', 'www']);
  
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
  const stopwords = new Set( ['a', 'about', 'an', 'are', 'as', 'at', 'be', 'by', 'com', 'de', 'en', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'la', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'und', 'the', 'www']);
  
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