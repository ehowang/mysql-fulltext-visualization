import React from 'react';
import './Explanation.css';

const Explanation = ({ activeStep }) => {
  const explanations = [
    {
      title: "Document Collection",
      content: `The full-text indexing process begins with a collection of documents. 
                In MySQL, each document corresponds to a row in a table, with a unique document identifier (DOC_ID).
                Full-text indexing can be applied to CHAR, VARCHAR, and TEXT columns only.
                Each storage engine (InnoDB and MyISAM) implements full-text indexing differently internally,
                but the core concepts remain the same.`
    },
    {
      title: "Tokenization",
      content: `During tokenization, MySQL breaks down each document's text into individual words or tokens.
                This process identifies the basic units that will be indexed. 
                Tokenization typically involves splitting text on whitespace and handling 
                punctuation appropriately. Each token's position in the original text is also recorded,
                which is important for phrase matching.`
    },
    {
      title: "Stopword Filtering",
      content: `MySQL filters out common words called stopwords that are considered to have little semantic value.
                Both InnoDB and MyISAM have built-in stopword lists, which can differ between the two engines.
                These lists can be customized using configuration options like innodb_ft_user_stopword_table
                for InnoDB or ft_stopword_file for MyISAM. Removing stopwords reduces index size and
                improves search relevance by focusing on more meaningful terms.`
    },
    {
      title: "Normalization",
      content: `Tokens are normalized to improve search effectiveness. In MySQL, this includes:
                - Converting to lowercase (so "Fox" and "fox" match)
                - Removing punctuation
                - Filtering out words shorter than the minimum length (3 characters for InnoDB, 4 for MyISAM)
                
                These settings can be configured using system variables like innodb_ft_min_token_size
                or ft_min_word_len. Normalization ensures that variations of the same word can be
                matched during searches.`
    },
    {
      title: "Inverted Index Creation",
      content: `The heart of full-text search is the inverted index. It maps each unique term to a 
                list of documents containing that term, along with position information. This is fundamentally
                different from traditional B-tree indexes used for exact matches or ranges.
                
                With an inverted index, MySQL can immediately look up which documents 
                contain a specific term without scanning the entire table, making searches extremely fast
                even across large collections of text.`
    },
    {
      title: "MySQL Internal Tables",
      content: `For InnoDB, full-text indexing creates a set of auxiliary tables that collectively form the inverted index.
                These tables are partitioned based on the character set sort weight of each word's first character,
                enabling parallel index creation for better performance.
                
                InnoDB also maintains common tables:
                - fts_*_deleted: Tracks documents that have been deleted but not yet removed from the index
                - fts_*_being_deleted: Records documents currently being removed from the index
                - fts_*_config: Stores metadata about the index state, including FTS_SYNCED_DOC_ID for consistency
                
                MyISAM implements full-text indexes differently but achieves the same functionality.`
    },
    {
      title: "Search Query Processing",
      content: `When a user executes a full-text search using MATCH() AGAINST() syntax, MySQL processes the query
                through the same tokenization and normalization steps used during indexing.
                
                MySQL supports three search modes:
                - Natural language mode (default): Treats the query as a phrase in natural human language
                - Boolean mode: Uses special operators (+, -, *, etc.) for precise control
                - Query expansion: Performs two searches, using results from the first to enhance the second
                
                Each normalized term in the query is then looked up in the inverted index to find matching documents.`
    },
    {
      title: "Retrieving Search Results",
      content: `Using the inverted index, MySQL identifies which documents contain the search terms.
                For natural language searches, it calculates a relevance score for each match based on:
                - Term frequency in the document
                - Inverse document frequency (rarity of the term across all documents)
                - Other factors depending on the storage engine
                
                By default, natural language search results are automatically sorted by decreasing relevance
                score (when MATCH() is in the WHERE clause and specific conditions are met).
                This presents the most relevant documents first, improving the search experience.`
    }
  ];
  
  return (
    <div className="explanation-panel">
      <h2>{explanations[activeStep].title}</h2>
      <p>{explanations[activeStep].content}</p>
    </div>
  );
};

export default Explanation;
