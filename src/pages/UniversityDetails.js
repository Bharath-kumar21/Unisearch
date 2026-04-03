import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUniversity } from "../context/UniversityContext";

function UniversityDetails() {
  const { id } = useParams();
  const { getUniversityById } = useUniversity();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await getUniversityById(id);
      setUniversity(data);
      setLoading(false);
    };
    fetchDetails();
  }, [id, getUniversityById]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "3rem" }}>Loading university details...</div>;
  }

  if (!university) {
    return <div style={{ textAlign: "center", padding: "3rem" }}>University not found</div>;
  }

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <div style={{ background: "var(--white)", borderRadius: "var(--radius)", padding: "2rem", border: "1px solid var(--border-color)" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{university.name}</h2>
        <p className="text-secondary" style={{ marginBottom: "2rem" }}>📍 {university.location} | Established {university.established} | {university.type}</p>

        <p style={{ marginBottom: "2rem", lineHeight: "1.6" }}>
          {university.description}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>Key Information</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}><strong>NIRF Ranking:</strong> #{university.ranking}</li>
              <li style={{ marginBottom: "0.5rem" }}><strong>Annual Fees:</strong> {university.fees ? `₹${university.fees}` : "Not listed"}</li>
              <li style={{ marginBottom: "0.5rem" }}><strong>Average Placement:</strong> {university.average_placement || "Not listed"}</li>
              <li style={{ marginBottom: "0.5rem" }}><strong>Placement Percentage:</strong> {university.placement_percentage || "Not listed"}</li>
            </ul>
          </div>

          <div>
            <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>Admission Requirements</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}><strong>Required Exam:</strong> {university.required_exam || "Not listed"}</li>
              <li style={{ marginBottom: "0.5rem" }}><strong>Avg. Rank Required:</strong> {university.average_rank_required || "Not listed"}</li>
            </ul>

            {university.branches && university.branches.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>Branch Cutoffs</h3>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {university.branches.map((branch, idx) => (
                    <li key={idx} style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                      <span className="text-secondary">{branch.name}</span>
                      <strong style={{ marginLeft: "1rem" }}>#{branch.cutoffRank}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {university.website && (
          <div style={{ marginTop: "2rem" }}>
            <a href={university.website} target="_blank" rel="noopener noreferrer" className="btn-black">
              Visit Official Website
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default UniversityDetails;
