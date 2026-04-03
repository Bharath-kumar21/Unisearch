import './Compare.css';
import React, { useState } from "react";
import { useUniversity } from "../context/UniversityContext";

function Compare() {
  const { universities, loading } = useUniversity();
  const [selectedIds, setSelectedIds] = useState(["1", "2", ""]); // Default first two selected just to show
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (index, value) => {
    const newSelected = [...selectedIds];
    newSelected[index] = value;
    setSelectedIds(newSelected);
  };

  const removeUniversity = (index) => {
    const newSelected = [...selectedIds];
    newSelected[index] = "";
    setSelectedIds(newSelected);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "3rem" }}>Loading universities...</div>;

  const selectedUniversities = selectedIds.map(id => id ? universities.find(u => u._id === id) : null);

  const formatNAAC = (rank) => parseInt(rank) <= 10 ? 'A++' : (parseInt(rank) <= 30 ? 'A+' : 'A');
  const formatPlacement = (rank) => Math.max(75, 100 - parseInt(rank)) + '%';

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <div className="compare-header">
        <h2>Compare Universities</h2>
        <p>Side-by-side comparison of selected universities</p>
      </div>

      <div style={{ background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", position: "relative" }}>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Criteria</th>
              {[0, 1, 2].map((i) => (
                <th key={i} style={{ width: "26.6%" }}>
                  {selectedUniversities[i] ? (
                    <div className="uni-header-card">
                      <div className="flex-between" style={{ width: '100%', alignItems: 'flex-start' }}>
                        <div className="uni-header-image"></div>
                        <button className="close-btn" onClick={() => removeUniversity(i)}>×</button>
                      </div>
                      <div className="uni-header-name">{selectedUniversities[i].name}</div>
                    </div>
                  ) : (
                    <div className="add-uni-card" onClick={() => { setDropdownOpen(i); setSearchTerm(""); }}>
                      <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>+</span>
                      <span>Add University</span>

                      {dropdownOpen === i && (
                        <div className="search-dropdown" onClick={e => e.stopPropagation()}>
                          <div className="search-dropdown-header">
                            <input
                              type="text"
                              className="search-input"
                              placeholder="Search universities..."
                              value={searchTerm}
                              autoFocus
                              onChange={e => setSearchTerm(e.target.value)}
                            />
                            <button className="close-dropdown-btn" onClick={(e) => { e.stopPropagation(); setDropdownOpen(null); }}>×</button>
                          </div>
                          <div className="search-options">
                            {universities
                              .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map((uni) => (
                                <div
                                  key={uni._id}
                                  className="search-option"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(i, uni._id);
                                    setDropdownOpen(null);
                                  }}
                                >
                                  {uni.name}
                                </div>
                              ))}
                            {universities.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                              <div className="search-no-results">No universities found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Location</td>
              {selectedUniversities.map((uni, i) => <td key={i}>{uni ? uni.location.split(',')[0] : "-"}</td>)}
            </tr>
            <tr>
              <td>NAAC Grade</td>
              {selectedUniversities.map((uni, i) => <td key={i}>{uni ? formatNAAC(uni.ranking) : "-"}</td>)}
            </tr>
            <tr>
              <td>NIRF Ranking</td>
              {selectedUniversities.map((uni, i) => <td key={i}>{uni ? `#${uni.ranking}` : "-"}</td>)}
            </tr>
            <tr>
              <td>Annual Fees</td>
              {selectedUniversities.map((uni, i) => <td key={i}>{uni ? `₹${uni.fees}/yr` : "-"}</td>)}
            </tr>
            <tr>
              <td>Placement %</td>
              {selectedUniversities.map((uni, i) => <td key={i}>{uni ? formatPlacement(uni.ranking) : "-"}</td>)}
            </tr>
            <tr>
              <td>Avg. Package</td>
              {selectedUniversities.map((uni, i) => <td key={i}>{uni ? uni.average_placement : "-"}</td>)}
            </tr>
            <tr>
              <td>Established</td>
              {selectedUniversities.map((uni, i) => <td key={i}>{uni ? uni.established : "-"}</td>)}
            </tr>
            <tr>
              <td>Required Exam</td>
              {selectedUniversities.map((uni, i) => <td key={i}>{uni ? (uni.required_exam || "-") : "-"}</td>)}
            </tr>
            <tr>
              <td>Avg Rank Req.</td>
              {selectedUniversities.map((uni, i) => <td key={i}>{uni ? (uni.average_rank_required || "-") : "-"}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Compare;
