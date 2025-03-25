import React, { useState } from 'react';
import './MySQLSyntax.css';

const MySQLSyntax = () => {
  const [activeTab, setActiveTab] = useState('create');
  
  const syntaxExamples = {
    create: [
      {
        title: "Creating a FULLTEXT index in CREATE TABLE",
        description: "Define a full-text index when creating a new table:",
        code: `CREATE TABLE articles (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  title VARCHAR(200),
  body TEXT,
  FULLTEXT (title, body)
) ENGINE=InnoDB;`
      },
      {
        title: "Adding a FULLTEXT index to an existing table",
        description: "Add a full-text index to a table that already exists:",
        code: `ALTER TABLE people 
ADD FULLTEXT INDEX fulltext_idx (first_name, last_name, bio);`
      },
      {
        title: "Using CREATE FULLTEXT INDEX",
        description: "Alternative syntax for adding a full-text index:",
        code: `CREATE FULLTEXT INDEX content_idx 
ON articles (content);`
      }
    ],
    search: [
      {
        title: "Natural Language Search",
        description: "Default search mode treating query as natural language:",
        code: `SELECT * FROM articles 
WHERE MATCH (title, body) AGAINST ('MySQL tutorial');`
      },
      {
        title: "Boolean Mode Search",
        description: "Search using boolean operators for precise control:",
        code: `SELECT * FROM articles 
WHERE MATCH (title, body) AGAINST ('+MySQL -indexing' IN BOOLEAN MODE);`
      },
      {
        title: "Query Expansion Search",
        description: "Broadened search that includes related terms:",
        code: `SELECT * FROM articles 
WHERE MATCH (title, body) AGAINST ('database' WITH QUERY EXPANSION);`
      },
      {
        title: "Sorting by relevance score",
        description: "Get results sorted by relevance with score displayed:",
        code: `SELECT *, MATCH (title, body) AGAINST ('MySQL') AS score 
FROM articles 
WHERE MATCH (title, body) AGAINST ('MySQL') 
ORDER BY score DESC;`
      }
    ],
    drop: [
      {
        title: "Removing a FULLTEXT index with ALTER TABLE",
        description: "Drop a full-text index using ALTER TABLE syntax:",
        code: `ALTER TABLE articles 
DROP INDEX ft_index;`
      },
      {
        title: "Removing a FULLTEXT index with DROP INDEX",
        description: "Drop a full-text index using DROP INDEX syntax:",
        code: `DROP INDEX fulltext_idx 
ON people;`
      }
    ],
    config: [
      {
        title: "Changing minimum word length for InnoDB",
        description: "Set the minimum length for indexed words in InnoDB:",
        code: `SET GLOBAL innodb_ft_min_token_size = 2;

# After changing, rebuild indexes:
ALTER TABLE articles DROP INDEX ft_index;
ALTER TABLE articles ADD FULLTEXT INDEX ft_index (content);`
      },
      {
        title: "Changing minimum word length for MyISAM",
        description: "Set the minimum length for indexed words in MyISAM:",
        code: `SET GLOBAL ft_min_word_len = 3;

# After changing, rebuild indexes:
REPAIR TABLE articles QUICK;`
      },
      {
        title: "Setting a custom stopword list for InnoDB",
        description: "Create and use a custom stopword table for InnoDB:",
        code: `# First, create a stopword table
CREATE TABLE my_stopwords (
  value VARCHAR(30)
);

# Insert stopwords
INSERT INTO my_stopwords (value) VALUES 
('the'), ('and'), ('is'), ('of'), ('a');

# Configure MySQL to use the custom stopword table
SET GLOBAL innodb_ft_server_stopword_table = 'mydb/my_stopwords';

# Rebuild your full-text indexes`
      }
    ]
  };
  
  return (
    <div className="mysql-syntax-container">
      <h2>MySQL Full-Text Index Syntax Guide</h2>
      <p className="intro">
        MySQL provides specific syntax for creating, using, and managing full-text indexes.
        This guide shows the correct syntax for common full-text indexing operations.
      </p>
      
      <div className="syntax-tabs">
        <button 
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Creating Indexes
        </button>
        <button 
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => setActiveTab('search')}
        >
          Search Syntax
        </button>
        <button 
          className={activeTab === 'drop' ? 'active' : ''}
          onClick={() => setActiveTab('drop')}
        >
          Dropping Indexes
        </button>
        <button 
          className={activeTab === 'config' ? 'active' : ''}
          onClick={() => setActiveTab('config')}
        >
          Configuration
        </button>
      </div>
      
      <div className="syntax-content">
        {syntaxExamples[activeTab].map((example, index) => (
          <div key={index} className="syntax-example">
            <h3>{example.title}</h3>
            <p>{example.description}</p>
            <pre className="code-block">
              <code>{example.code}</code>
            </pre>
          </div>
        ))}
        
        {activeTab === 'create' && (
          <div className="syntax-notes">
            <h3>Important Notes on Creating Full-Text Indexes</h3>
            <ul>
              <li>Full-text indexes can only be created on CHAR, VARCHAR, or TEXT columns.</li>
              <li>All columns in a full-text index must use the same character set and collation.</li>
              <li>A table can have multiple full-text indexes, but a column can only appear in one full-text index.</li>
              <li>For large tables, it's more efficient to load data first, then create the full-text index.</li>
              <li>InnoDB automatically adds an FTS_DOC_ID column if one is not explicitly created.</li>
              <li>Full-text indexing always operates on the entire column; prefix indexing is not supported.</li>
            </ul>
          </div>
        )}
        
        {activeTab === 'search' && (
          <div className="syntax-notes">
            <h3>Important Notes on Search Syntax</h3>
            <ul>
              <li>The columns in the MATCH() function must match those defined in a full-text index.</li>
              <li>By default, words shorter than the minimum word length are not indexed or searchable.</li>
              <li>Natural language searches ignore words that appear in more than 50% of the rows.</li>
              <li>Boolean mode searches do not have the 50% threshold limitation.</li>
              <li>For natural language searches, results are automatically sorted by relevance when MATCH() is used in the WHERE clause (under specific conditions).</li>
              <li>MySQL limits the number of words that can be searched at once to 16 by default.</li>
            </ul>
          </div>
        )}
        
        {activeTab === 'drop' && (
          <div className="syntax-notes">
            <h3>Important Notes on Dropping Full-Text Indexes</h3>
            <ul>
              <li>In InnoDB, dropping a full-text index does not remove the FTS_DOC_ID column that was added to support it.</li>
              <li>Removing the FTS_DOC_ID column would require rebuilding the entire table.</li>
              <li>If you plan to recreate the index later, it's more efficient to keep the FTS_DOC_ID column.</li>
              <li>Dropping a full-text index frees up the storage space used by the index.</li>
            </ul>
          </div>
        )}
        
        {activeTab === 'config' && (
          <div className="syntax-notes">
            <h3>Important Notes on Configuration</h3>
            <ul>
              <li>Configuration changes usually require a server restart to take effect.</li>
              <li>After changing parameters like minimum word length, existing full-text indexes must be rebuilt.</li>
              <li>For InnoDB, the default minimum word length is 3 characters.</li>
              <li>For MyISAM, the default minimum word length is 4 characters.</li>
              <li>Stopword lists and minimum word length settings can significantly impact index size and search behavior.</li>
              <li>Custom stopword tables provide fine-grained control over which words are excluded from indexing.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySQLSyntax;