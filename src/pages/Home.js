import './Home.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();

  const [examType, setExamType] = useState("");
  const [rank, setRank] = useState("");

  const handleSearch = () => {
    navigate("/universities", {
      state: {
        initExam: examType,
        initRank: rank
      }
    });
  };

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <h1>Find the Right University for Your Future</h1>
          <p>
            Enter your exam type and rank to discover universities you can get into.
          </p>

          <div className="search-banner">
            <div className="search-fields">
              <div className="search-input-group">
                <span className="text-secondary">📝</span>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                >
                  <option value="">Select Exam Type</option>
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="CUET">CUET</option>
                  <option value="State CET">State CET</option>
                  <option value="Institute Specific">Institute Specific</option>
                </select>
              </div>
              <div className="search-input-group">
                <span className="text-secondary">🏅</span>
                <input
                  type="number"
                  placeholder="Enter your rank"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <button
              className="btn-black btn-large flex-center"
              style={{ gap: '0.5rem', justifyContent: 'center' }}
              onClick={handleSearch}
            >
              <span>🔍</span> Find Universities
            </button>
          </div>

          <div className="how-it-works-container">
            <h2>How it works?</h2>
            <div className="how-it-works-grid">
              <div className="how-it-works-card">
                <h3>Select Exam</h3>
                <p>choose your entrance<br />exam type</p>
              </div>
              <div className="how-it-works-card">
                <h3>Enter Rank</h3>
                <p>provide your rank to<br />find matching universities</p>
              </div>
              <div className="how-it-works-card">
                <h3>Explore</h3>
                <p>compare and decide<br />based on data</p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default Home;
