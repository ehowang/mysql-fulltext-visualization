import React, { useState } from 'react';
import './SearchTypes.css';

const SearchTypes = () => {
  const [activeTab, setActiveTab] = useState('natural');
  
  // Sample documents collection
  const sampleDocuments = [
    { 
      id: 1, 
      title: "Introduction to MySQL Full-Text Search",
      content: "MySQL full-text search allows users to search efficiently for words or phrases. It is a fundamental feature used in many applications."
    },
    { 
      id: 2, 
      title: "Indexing Strategies in MySQL",
      content: "Effective indexing is critical for search performance in MySQL. Full-text indices map terms to the documents that contain them."
    },
    { 
      id: 3, 
      title: "Search Optimization Techniques",
      content: "Various techniques can improve MySQL search quality, including proper indexing, query optimization, and understanding relevance algorithms."
    },
    { 
      id: 4, 
      title: "Building a MySQL Search Engine",
      content: "A basic MySQL-based search engine includes components for indexing and query processing. Each component plays a vital role in the overall system."
    },
    { 
      id: 5, 
      title: "Advanced MySQL Full-Text Features",
      content: "MySQL supports advanced search features including boolean operators, phrase matching, and relevance tuning that make it powerful for text search needs."
    }
  ];
  
  // Search results based on search type
  const searchResults = {
    natural: [
      { id: 1, score: 1.5, highlight: ["MySQL full-text search", "search efficiently"] },
      { id: 5, score: 1.2, highlight: ["MySQL supports advanced search features", "powerful for text search needs"] },
      { id: 2, score: 0.9, highlight: ["search performance in MySQL"] }
    ],
    boolean: [
      { id: 1, score: "N/A", highlight: ["MySQL full-text search", "search efficiently"] },
      { id: 5, score: "N/A", highlight: ["MySQL supports advanced search features", "text search needs"] },
      { id: 4, score: "N/A", highlight: ["MySQL-based search engine"] },
      { id: 2, score: "N/A", highlight: ["search performance in MySQL"] }
    ],
    expansion: [
      { id: 1, score: 1.8, highlight: ["MySQL full-text search", "search efficiently"] },
      { id: 5, score: 1.7, highlight: ["MySQL supports advanced search features", "text search needs"] },
      { id: 4, score: 1.5, highlight: ["MySQL-based search engine"] },
      { id: 2, score: 1.4, highlight: ["search performance in MySQL"] },
      { id: 3, score: 1.0, highlight: ["MySQL search quality"] }
    ]
  };
  
  const searchQueries = {
    natural: "SELECT * FROM articles WHERE MATCH(title, content) AGAINST('search');",
    boolean: "SELECT * FROM articles WHERE MATCH(title, content) AGAINST('+search +mysql -optimization' IN BOOLEAN MODE);",
    expansion: "SELECT * FROM articles WHERE MATCH(title, content) AGAINST('search' WITH QUERY EXPANSION);"
  };
  
  const searchExplanations = {
    natural: {
      title: "Natural Language Mode",
      content: `This is the default search mode in MySQL. It interprets the search string as a phrase in natural human language
                and returns results based on relevance. Documents that contain more of the search terms or rarer terms
                receive higher relevance scores.
                
                Features:
                - Automatic stopword filtering
                - Results sorted by relevance score
                - Double quotes for exact phrase matching
                - Best for simple keyword searches where natural language interpretation is desired`,
      advantages: [
        "Simple to use - no special syntax required",
        "Automatic relevance sorting",
        "Good for basic search needs"
      ],
      limitations: [
        "Less precise control over search terms",
        "Can't force terms to be included or excluded",
        "Limited to more natural language patterns"
      ],
      operators: [
        { symbol: '"phrase"', description: "Matches the exact phrase (words in that exact order)" }
      ]
    },
    boolean: {
      title: "Boolean Mode",
      content: `Boolean mode provides precise control over which terms must or must not appear in the results.
                It uses special operators that allow you to include or exclude words, adjust their weight in the
                relevance calculation, perform wildcard matching, and more.
                
                Unlike natural language mode, boolean mode doesn't automatically sort results by relevance
                and doesn't automatically filter stopwords.`,
      advantages: [
        "Precise control over search criteria",
        "Support for complex query expressions",
        "Can search for stopwords",
        "No 50% relevance threshold for matches"
      ],
      limitations: [
        "More complex syntax",
        "No automatic relevance sorting",
        "Requires understanding of boolean operators"
      ],
      operators: [
        { symbol: "+word", description: "The word must be present in each result" },
        { symbol: "-word", description: "The word must not be present in any result" },
        { symbol: "word*", description: "Wildcard - matches words that begin with the prefix" },
        { symbol: '"phrase"', description: "Matches the exact phrase" },
        { symbol: ">word", description: "Increases the word's contribution to relevance" },
        { symbol: "<word", description: "Decreases the word's contribution to relevance" },
        { symbol: "~word", description: "The word contributes negatively to relevance" },
        { symbol: "(expr)", description: "Groups expressions for more complex queries" }
      ]
    },
    expansion: {
      title: "Query Expansion Mode",
      content: `Query expansion mode (also called blind query expansion) performs a two-step search process:
                
                1. First, it executes a natural language search using the original search terms
                2. Then, it adds words from the most relevant documents to the search terms
                3. Finally, it performs a second search with the expanded query
                
                This can help find documents that are semantically related to the search terms,
                even if they don't contain the exact terms.`,
      advantages: [
        "Finds semantically related content",
        "Improves search recall",
        "Helpful when users provide limited search terms",
        "Can discover related concepts automatically"
      ],
      limitations: [
        "Can reduce precision by including unintended terms",
        "May return unexpected results",
        "Performance impact from two-phase search",
        "Less predictable than other search modes"
      ],
      operators: [
        { symbol: "N/A", description: "Uses the same syntax as natural language mode, with the WITH QUERY EXPANSION modifier" }
      ]
    }
  };
  
  return (
    <div className="search-types-container">
      <h2>MySQL Full-Text Search Types</h2>
      <p className="intro">
        MySQL supports three distinct types of full-text searches, each with its own strengths and use cases.
      </p>
      
      <div className="search-types-tabs">
        <button 
          className={activeTab === 'natural' ? 'active' : ''}
          onClick={() => setActiveTab('natural')}
        >
          Natural Language
        </button>
        <button 
          className={activeTab === 'boolean' ? 'active' : ''}
          onClick={() => setActiveTab('boolean')}
        >
          Boolean Mode
        </button>
        <button 
          className={activeTab === 'expansion' ? 'active' : ''}
          onClick={() => setActiveTab('expansion')}
        >
          Query Expansion
        </button>
      </div>
      
      <div className="search-type-content">
        <div className="search-type-header">
          <h3>{searchExplanations[activeTab].title}</h3>
        </div>
        
        <div className="search-type-details">
          <div className="search-explanation">
            <p>{searchExplanations[activeTab].content}</p>
          </div>
          
          <div className="search-example">
            <h4>Example Query</h4>
            <div className="code-block">{searchQueries[activeTab]}</div>
          </div>
          
          <div className="search-operators">
            <h4>Available Operators</h4>
            <table className="operators-table">
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {searchExplanations[activeTab].operators.map((op, index) => (
                  <tr key={index}>
                    <td className="operator-symbol">{op.symbol}</td>
                    <td>{op.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="pros-cons">
            <div className="pros">
              <h4>Advantages</h4>
              <ul>
                {searchExplanations[activeTab].advantages.map((adv, index) => (
                  <li key={index}>{adv}</li>
                ))}
              </ul>
            </div>
            
            <div className="cons">
              <h4>Limitations</h4>
              <ul>
                {searchExplanations[activeTab].limitations.map((lim, index) => (
                  <li key={index}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="search-results-demo">
          <h4>Sample Results for Search Term: "search"</h4>
          <div className="results-list">
            {searchResults[activeTab].map(result => {
              const doc = sampleDocuments.find(d => d.id === result.id);
              
              return (
                <div key={doc.id} className="result-item">
                  <div className="result-header">
                    <h5>{doc.title}</h5>
                    {activeTab !== 'boolean' && (
                      <div className="relevance-score">Relevance: {result.score}</div>
                    )}
                  </div>
                  <p className="result-content">
                    {doc.content.split(' ').map((word, idx) => {
                      // Check if this word is part of a highlighted phrase
                      const isHighlighted = result.highlight.some(phrase => 
                        doc.content.toLowerCase().includes(phrase.toLowerCase()) && 
                        phrase.toLowerCase().split(' ').includes(word.toLowerCase().replace(/[^\w\s]/g, ''))
                      );
                      
                      return (
                        <span key={idx} className={isHighlighted ? 'highlight' : ''}>
                          {word}{' '}
                        </span>
                      );
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTypes;