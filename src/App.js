import React, { useState } from 'react';
import IndexingAnimation from './components/IndexingAnimation';
import SearchDemo from './components/SearchDemo';
import Explanation from './components/Explanation';
import SearchTypes from './components/SearchTypes';
import PerformanceComparison from './components/PerformanceComparison';
import MySQLSyntax from './components/MySQLSyntax';
import './App.css';

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('animation');
  
  const totalSteps = 8;
  
  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, totalSteps - 1));
  };
  
  const handlePrev = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };
  
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleReset = () => {
    setActiveStep(0);
    setIsPlaying(false);
  };
  
  const handleSpeedChange = (e) => {
    setPlaybackSpeed(parseFloat(e.target.value));
  };
  
  return (
    <div className="app">
      <header className="header">
        <h1>MySQL Full-Text Indexing Visualization</h1>
        <p>Understanding how text search engines work under the hood</p>
      </header>
      
      <nav className="main-nav">
        <button 
          className={activeTab === 'animation' ? 'active' : ''}
          onClick={() => setActiveTab('animation')}
        >
          Indexing Process
        </button>
        <button 
          className={activeTab === 'search-types' ? 'active' : ''}
          onClick={() => setActiveTab('search-types')}
        >
          Search Types
        </button>
        <button 
          className={activeTab === 'performance' ? 'active' : ''}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button 
          className={activeTab === 'mysql-syntax' ? 'active' : ''}
          onClick={() => setActiveTab('mysql-syntax')}
        >
          MySQL Syntax
        </button>
        <button 
          className={activeTab === 'demo' ? 'active' : ''}
          onClick={() => setActiveTab('demo')}
        >
          Try It
        </button>
      </nav>
      
      <main className="main-content">
        {activeTab === 'animation' && (
          <>
            <div className="animation-header">
              <h2>Full-Text Indexing Process</h2>
              <div className="engine-selector">
                <label>Storage Engine:</label>
                <select>
                  <option value="innodb">InnoDB</option>
                  <option value="myisam">MyISAM</option>
                </select>
                <div className="tooltip">
                  <span className="info-icon">ⓘ</span>
                  <span className="tooltip-text">
                    MySQL supports full-text indexes in both InnoDB and MyISAM storage engines.
                    The internal implementation differs, but the concept remains the same.
                  </span>
                </div>
              </div>
            </div>
            
            <div className="controls">
              <button onClick={handlePrev} disabled={activeStep === 0 || isPlaying}>
                Previous
              </button>
              <button onClick={handlePlay}>
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button onClick={handleNext} disabled={activeStep === totalSteps - 1 || isPlaying}>
                Next
              </button>
              <button onClick={handleReset}>
                Reset
              </button>
              <div className="speed-control">
                <label htmlFor="speed">Speed:</label>
                <select id="speed" value={playbackSpeed} onChange={handleSpeedChange}>
                  <option value="0.5">0.5x</option>
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="4">4x</option>
                </select>
              </div>
            </div>
            
            <div className="visualization-container">
              <IndexingAnimation 
                activeStep={activeStep} 
                setActiveStep={setActiveStep}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                playbackSpeed={playbackSpeed}
                totalSteps={totalSteps}
              />
            </div>
            
            <Explanation activeStep={activeStep} />
          </>
        )}
        
        {activeTab === 'search-types' && (
          <SearchTypes />
        )}
        
        {activeTab === 'performance' && (
          <PerformanceComparison />
        )}
        
        {activeTab === 'mysql-syntax' && (
          <MySQLSyntax />
        )}
        
        {activeTab === 'demo' && (
          <div className="demo-section">
            <h2>Try it yourself</h2>
            <SearchDemo />
          </div>
        )}
      </main>
      
      <footer className="footer">
        <p>Created as an educational resource to understand MySQL full-text indexing and searching</p>
      </footer>
    </div>
  );
}

export default App;