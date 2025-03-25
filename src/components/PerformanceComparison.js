import React, { useState } from 'react';
import './PerformanceComparison.css';

const PerformanceComparison = () => {
  const [datasetSize, setDatasetSize] = useState('medium');
  
  // Performance data for different dataset sizes
  const performanceData = {
    small: {
      fulltext: 15,
      like: 25,
      regex: 38,
      storage: {
        table: 10,
        fulltextIndex: 4
      },
      write: {
        withoutIndex: 5,
        withIndex: 8
      }
    },
    medium: {
      fulltext: 48,
      like: 380,
      regex: 620,
      storage: {
        table: 100,
        fulltextIndex: 40
      },
      write: {
        withoutIndex: 50,
        withIndex: 85
      }
    },
    large: {
      fulltext: 120,
      like: 3800,
      regex: 6500,
      storage: {
        table: 1000,
        fulltextIndex: 400
      },
      write: {
        withoutIndex: 500,
        withIndex: 850
      }
    }
  };
  
  // Performance tips
  const performanceTips = [
    {
      title: "Create indexes only on columns that need them",
      description: "Only add full-text indexes to columns that will be searched frequently. Every additional column increases index size and maintenance cost."
    },
    {
      title: "Load data before creating indexes",
      description: "For large datasets, it's much faster to load all data first, then create the full-text index afterward, rather than loading data into a table with an existing index."
    },
    {
      title: "Consider disabling indexes for bulk operations",
      description: "For large batch inserts or updates, consider temporarily disabling the full-text index, performing the operations, and then rebuilding the index."
    },
    {
      title: "Optimize tables regularly",
      description: "Run OPTIMIZE TABLE periodically on tables with full-text indexes, especially after many updates or deletes, to reclaim space and improve search performance."
    },
    {
      title: "Use covering indexes when possible",
      description: "If your queries only need data from columns that are part of the full-text index, MySQL can often satisfy the query without accessing the table data."
    },
    {
      title: "Adjust min/max word length as needed",
      description: "Consider your data and adjust innodb_ft_min_token_size or ft_min_word_len if you need to search for shorter terms. Remember that smaller values increase index size."
    },
    {
      title: "Customize stopword lists",
      description: "For specialized content, customize the stopword list to better reflect which common words in your domain should be excluded from indexing."
    },
    {
      title: "Monitor index size",
      description: "Full-text indexes can be large. Monitor their size using information_schema.INNODB_FT_INDEX_CACHE or SHOW TABLE STATUS to ensure they don't cause storage issues."
    }
  ];
  
  return (
    <div className="performance-container">
      <h2>MySQL Full-Text Search Performance</h2>
      
      <div className="dataset-control">
        <label>Dataset Size:</label>
        <div className="button-group">
          <button 
            className={datasetSize === 'small' ? 'active' : ''} 
            onClick={() => setDatasetSize('small')}
          >
            Small (1,000 records)
          </button>
          <button 
            className={datasetSize === 'medium' ? 'active' : ''} 
            onClick={() => setDatasetSize('medium')}
          >
            Medium (100,000 records)
          </button>
          <button 
            className={datasetSize === 'large' ? 'active' : ''} 
            onClick={() => setDatasetSize('large')}
          >
            Large (1,000,000 records)
          </button>
        </div>
      </div>
      
      <div className="performance-charts">
        <div className="chart-container">
          <h3>Search Query Performance (ms)</h3>
          <div className="chart-description">
            Comparison of query execution time for different search methods on text data.
            Lower times are better.
          </div>
          <div className="bar-chart search-performance">
            <div className="chart-item">
              <div className="label">FULLTEXT</div>
              <div className="bar fulltext" style={{ width: `${Math.min(100, performanceData[datasetSize].fulltext / 65 * 100)}%` }}>
                {performanceData[datasetSize].fulltext} ms
              </div>
            </div>
            <div className="chart-item">
              <div className="label">LIKE '%term%'</div>
              <div className="bar like" style={{ width: `${Math.min(100, performanceData[datasetSize].like / 65 * 100)}%` }}>
                {performanceData[datasetSize].like} ms
              </div>
            </div>
            <div className="chart-item">
              <div className="label">REGEXP</div>
              <div className="bar regex" style={{ width: `${Math.min(100, performanceData[datasetSize].regex / 65 * 100)}%` }}>
                {performanceData[datasetSize].regex} ms
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Storage Requirements (MB)</h3>
          <div className="chart-description">
            Comparison of storage space required for table data vs. full-text index.
          </div>
          <div className="bar-chart storage-requirements">
            <div className="chart-item">
              <div className="label">Table Data</div>
              <div className="bar table-data" style={{ width: `${Math.min(100, performanceData[datasetSize].storage.table / 10 * 100)}%` }}>
                {performanceData[datasetSize].storage.table} MB
              </div>
            </div>
            <div className="chart-item">
              <div className="label">FULLTEXT Index</div>
              <div className="bar index-size" style={{ width: `${Math.min(100, performanceData[datasetSize].storage.fulltextIndex / 10 * 100)}%` }}>
                {performanceData[datasetSize].storage.fulltextIndex} MB
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Write Operation Performance (ms/1000 records)</h3>
          <div className="chart-description">
            Impact of full-text index on write operations (INSERT/UPDATE/DELETE).
            Lower times are better.
          </div>
          <div className="bar-chart write-performance">
            <div className="chart-item">
              <div className="label">Without FULLTEXT</div>
              <div className="bar without-index" style={{ width: `${Math.min(100, performanceData[datasetSize].write.withoutIndex / 8.5 * 100)}%` }}>
                {performanceData[datasetSize].write.withoutIndex} ms
              </div>
            </div>
            <div className="chart-item">
              <div className="label">With FULLTEXT</div>
              <div className="bar with-index" style={{ width: `${Math.min(100, performanceData[datasetSize].write.withIndex / 8.5 * 100)}%` }}>
                {performanceData[datasetSize].write.withIndex} ms
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="performance-implications">
        <h3>Key Performance Considerations</h3>
        <div className="implications-content">
          <div className="implication">
            <h4>FULLTEXT vs. LIKE Comparison</h4>
            <p>
              Full-text search significantly outperforms LIKE and REGEXP queries, especially as data volume grows.
              The performance gap becomes dramatic with larger datasets because LIKE and REGEXP perform table scans,
              while FULLTEXT uses an optimized inverted index.
            </p>
          </div>
          
          <div className="implication">
            <h4>Storage Impact</h4>
            <p>
              Full-text indexes typically require 30-50% of the original table size for storage.
              This overhead is the trade-off for improved search performance. When planning your
              database, ensure you have sufficient storage for both the data and the indexes.
            </p>
          </div>
          
          <div className="implication">
            <h4>Write Performance</h4>
            <p>
              Tables with full-text indexes experience slower write operations because the index
              must be updated with each change. The impact ranges from 20-70% slower, depending
              on the specific operation and data characteristics. For write-heavy applications,
              this trade-off must be carefully considered.
            </p>
          </div>
        </div>
      </div>
      
      <div className="optimization-tips">
        <h3>Optimization Tips</h3>
        <div className="tips-container">
          {performanceTips.map((tip, index) => (
            <div key={index} className="tip-card">
              <h4>{tip.title}</h4>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceComparison;