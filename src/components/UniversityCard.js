import './UniversityCard.css';
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSaved } from "../context/SavedContext";

function UniversityCard({ uni }) {
  const { toggleSave, isSaved } = useSaved();

  if (!uni) {
    return null;
  }

  // Mock NAAC grade based on ranking to match wireframe
  const naacGrade = parseInt(uni.ranking) <= 10 ? "A++" : (parseInt(uni.ranking) <= 30 ? "A+" : "A");

  // Format fees and placement to match wireframe style
  const formattedFees = uni.fees
    ? (uni.fees.includes('₹') ? `${uni.fees}/yr` : `₹${uni.fees}/yr`)
    : "N/A";

  // Extract number from placement like "18 LPA" to "95%" mock for the badge if needed, 
  // actually the wireframe shows "Placement: 95%". We now show the real data.
  // const placementPercent = uni.placement_percentage || "N/A";

  const saved = isSaved(uni._id);

  return (
    <div className="uni-card">
      <div className="card-header">
        <h3>{uni.name}</h3>
        <button
          className="save-btn"
          onClick={() => toggleSave(uni._id)}
          title={saved ? "Remove from saved" : "Save university"}
          style={{ color: saved ? '#111827' : '#9CA3AF' }}
        >
          {saved ? '🔖' : '📑'}
        </button>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span className="card-location">
            <span className="loc-icon">📍</span>
            {uni.location.split(',')[0]}
          </span>
          <span className="naac-badge">NAAC {naacGrade}</span>
        </div>

        <div className="card-stats">
          <div>
            <span>Fees:</span>
            <strong>{formattedFees}</strong>
          </div>
        </div>
      </div>

      <div className="card-divider" />

      <div className="card-footer">
        <Link to={`/university/${uni._id}`} className="btn-outline">View Details</Link>
        {uni.website && (
          <a href={uni.website} target="_blank" rel="noopener noreferrer" className="btn-black">Website</a>
        )}
      </div>
    </div>
  );
}

UniversityCard.propTypes = {
  uni: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    ranking: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fees: PropTypes.string,
    average_placement: PropTypes.string,
    website: PropTypes.string,
    branches: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      cutoffRank: PropTypes.string
    }))
  }).isRequired
};

export default UniversityCard;
