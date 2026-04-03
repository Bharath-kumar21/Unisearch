import './Universities.css';
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UniversityCard from "../components/UniversityCard";
import { useUniversity } from "../context/UniversityContext";

function Universities() {
  const location = useLocation();
  const initState = location.state || {};
  const { universities, loading } = useUniversity();

  const [search, setSearch] = useState(initState.initSearch || "");
  const [sortOption, setSortOption] = useState("Ranking");

  // Filter states
  const [selectedExams, setSelectedExams] = useState(
    initState.initExam ? [initState.initExam] : []
  );
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCETStates, setSelectedCETStates] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedNAACs, setSelectedNAACs] = useState(initState.initNAAC ? [initState.initNAAC] : []);
  const [selectedFees, setSelectedFees] = useState(initState.initFees ? [initState.initFees] : []);
  const [rankInput, setRankInput] = useState(initState.initRank || "");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Update states if location state changes (e.g. from nav click again)
  useEffect(() => {
    if (location.state) {
      if (location.state.initSearch) setSearch(location.state.initSearch);
      if (location.state.initNAAC) setSelectedNAACs([location.state.initNAAC]);
      if (location.state.initFees) setSelectedFees([location.state.initFees]);
      if (location.state.initExam) setSelectedExams([location.state.initExam]);
      if (location.state.initRank) setRankInput(location.state.initRank);
    }
  }, [location.state]);

  // Clear CET states if State CET is unmarked
  useEffect(() => {
    if (!selectedExams.includes("State CET")) {
      setSelectedCETStates([]);
    }
  }, [selectedExams]);

  // Helper to parse "Top 500" => 500, "Top 15000" => 15000, etc.
  const parseRankCutoff = (rankStr) => {
    if (!rankStr) return null;
    const match = rankStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Filtering logic
  const filtered = universities
    .filter((u) => {
      const matchesSearch =
        (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
        (u.location && u.location.toLowerCase().includes(search.toLowerCase()));

      const examMatch = selectedExams.length === 0 || (u.required_exam && selectedExams.some(exam => {
        const examLower = exam.toLowerCase();
        const reqLower = u.required_exam.toLowerCase();

        if (reqLower === examLower) {
          // If the exam is State CET, require the university to be in one of the selected CET states (if any are selected)
          if (examLower === "state cet" && selectedCETStates.length > 0) {
            return selectedCETStates.some(s => u.location && u.location.toLowerCase().includes(s.toLowerCase()));
          }
          return true;
        }
        return false;
      }));

      // Rank-based filtering: user's rank must be <= the university's cutoff
      let rankMatch = true;
      if (rankInput) {
        const userRank = parseInt(rankInput, 10);
        if (!isNaN(userRank)) {
          const cutoff = parseRankCutoff(u.average_rank_required);
          if (cutoff !== null) {
            rankMatch = userRank <= cutoff;
          } else {
            // If the university has no parseable cutoff, exclude it when rank filter is active
            rankMatch = false;
          }
        }
      }

      const stateMatch = selectedStates.length === 0 || (u.location && selectedStates.some(s => u.location.toLowerCase().includes(s.toLowerCase())));
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(u.type);

      // NAAC derivation matching the card
      const naacGrade = (u.ranking && parseInt(u.ranking) <= 10) ? "A++" : ((u.ranking && parseInt(u.ranking) <= 30) ? "A+" : "A");
      const naacMatch = selectedNAACs.length === 0 || selectedNAACs.includes(naacGrade);

      let numericFees = 0;
      if (u.fees) {
        if (u.fees.endsWith('L')) numericFees = parseFloat(u.fees.replace('L', '')) * 100000;
        else if (u.fees.endsWith('K')) numericFees = parseFloat(u.fees.replace('K', '')) * 1000;
      }

      let feesMatch = selectedFees.length === 0;
      if (selectedFees.length > 0 && u.fees) {
        if (selectedFees.includes("Under ₹1L") && numericFees < 100000) feesMatch = true;
        if (selectedFees.includes("₹1L - ₹3L") && numericFees >= 100000 && numericFees <= 300000) feesMatch = true;
        if (selectedFees.includes("₹3L - ₹5L") && numericFees > 300000 && numericFees <= 500000) feesMatch = true;
        if (selectedFees.includes("Above ₹5L") && numericFees > 500000) feesMatch = true;
      } else if (selectedFees.length > 0 && !u.fees) {
        feesMatch = false;
      }

      return matchesSearch && examMatch && rankMatch && stateMatch && typeMatch && naacMatch && feesMatch;
    })
    .sort((a, b) => {
      if (sortOption === "Ranking") {
        return a.ranking - b.ranking;
      } else if (sortOption === "Name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const handleCheckboxChange = (setter, value, currentState) => {
    if (currentState.includes(value)) {
      setter(currentState.filter(item => item !== value));
    } else {
      setter([...currentState, value]);
    }
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container page-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '2rem' }}>
          <span>⚙️</span>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Filters</h2>
        </div>

        {/* Rank Filter */}
        <div className="filter-section">
          <div className="filter-title">Your Rank</div>
          <input
            type="number"
            placeholder="Enter your rank"
            value={rankInput}
            onChange={(e) => { setRankInput(e.target.value); setCurrentPage(1); }}
            min="1"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div className="filter-section">
          <div className="filter-title">Exam Type</div>
          {[
            "JEE Main", "JEE Advanced", "CUET", "State CET", "Institute Specific"
          ].map(exam => (
            <label key={exam} className="checkbox-label">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(setSelectedExams, exam, selectedExams)}
                checked={selectedExams.includes(exam)}
              /> {exam}
            </label>
          ))}
        </div>

        {selectedExams.includes("State CET") && (
          <div className="filter-section" style={{ marginLeft: '1rem', marginTop: '-0.5rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border-color)' }}>
            <div className="filter-title" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Select CET State</div>
            {[
              "Maharashtra", "West Bengal", "Tamil Nadu", "Telangana", "Andhra Pradesh", "Karnataka"
            ].map(state => (
              <label key={state} className="checkbox-label" style={{ fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(setSelectedCETStates, state, selectedCETStates)}
                  checked={selectedCETStates.includes(state)}
                /> {state}
              </label>
            ))}
          </div>
        )}

        <div className="filter-section">
          <div className="filter-title">State / City</div>
          {[
            "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh",
            "West Bengal", "Uttarakhand", "Assam", "Telangana", "Punjab",
            "Rajasthan", "Madhya Pradesh", "Odisha", "Gujarat", "Andhra Pradesh", "Chandigarh"
          ].map(state => (
            <label key={state} className="checkbox-label">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(setSelectedStates, state, selectedStates)}
                checked={selectedStates.includes(state)}
              /> {state}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <div className="filter-title">Institution Type</div>
          {["Public", "Private"].map(type => (
            <label key={type} className="checkbox-label">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(setSelectedTypes, type, selectedTypes)}
                checked={selectedTypes.includes(type)}
              /> {type}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <div className="filter-title">NAAC Grade</div>
          {["A++", "A+", "A"].map(grade => (
            <label key={grade} className="checkbox-label">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(setSelectedNAACs, grade, selectedNAACs)}
                checked={selectedNAACs.includes(grade)}
              /> {grade}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <div className="filter-title">Fees Range</div>
          {["Under ₹1L", "₹1L - ₹3L", "₹3L - ₹5L", "Above ₹5L"].map(range => (
            <label key={range} className="checkbox-label">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(setSelectedFees, range, selectedFees)}
                checked={selectedFees.includes(range)}
              /> {range}
            </label>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main>
        <div style={{ marginBottom: "1.5rem" }}>
          {/* We reuse the nav-search style for the page search */}
          <div className="nav-search-wrapper" style={{ width: '100%', maxWidth: '100%' }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by university name or location..."
              className="nav-search"
              style={{ width: '100%' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="results-header" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--white)' }}>
          <div>Showing {filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results</div>
          <div className="flex-center" style={{ gap: '0.5rem' }}>
            <span>Sort by:</span>
            <select
              className="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="Ranking">Ranking</option>
              <option value="Name">Name</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            <h3>Loading universities...</h3>
          </div>
        ) : (
          <>
            <div className="grid-cols-3" style={{ marginTop: '1.5rem', marginBottom: '3rem' }}>
              {currentItems.map((uni) => (
                <UniversityCard key={uni._id} uni={uni} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                <h3>No universities found</h3>
                <p>Try adjusting your search query or filters.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex-center" style={{ gap: '0.5rem', marginTop: '2rem' }}>
                <button
                  className="btn-outline"
                  style={{ width: 'auto', padding: '0.4rem 1rem' }}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show current page, first, last, and pages adjacent to current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        className={currentPage === pageNumber ? "btn-black" : "btn-outline"}
                        style={{ width: 'auto', padding: '0.4rem 1rem' }}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  // Show ellipsis for gaps
                  if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={pageNumber} style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>...</span>;
                  }
                  return null;
                })}

                <button
                  className="btn-outline"
                  style={{ width: 'auto', padding: '0.4rem 1rem' }}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Universities;
