import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSaved } from "../context/SavedContext";
import { useAuth } from "../context/AuthContext";
import { useUniversity } from "../context/UniversityContext";
import UniversityCard from "../components/UniversityCard";

function Profile() {
    const navigate = useNavigate();
    const { savedUniversities } = useSaved();
    const { user, logout } = useAuth(); // Use proper auth context
    const { universities, loading } = useUniversity();

    // Map saved IDs to actual university data objects
    const savedData = savedUniversities
        .map(id => universities.find(u => u._id === id))
        .filter(u => u !== undefined); // filter out any invalid/missing IDs

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        return null; // The protected route in App.js will handle redirect, but just in case
    }

    if (loading) {
        return <div style={{ textAlign: "center", padding: "3rem" }}>Loading profile data...</div>;
    }

    return (
        <div className="container page-layout" style={{ display: 'block' }}>
            <div style={{ padding: "3rem 0", borderBottom: '1px solid var(--border-color)', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>My Profile</h2>
                <p className="text-secondary">Manage your preferences and saved universities</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>

                {/* Profile Sidebar */}
                <div style={{ background: "var(--white)", padding: "2rem", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--hover-bg)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                            👤
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user.name}</h3>
                        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{user.email}</p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            <span className="text-secondary">Joined</span>
                            <span style={{ fontWeight: 500 }}>{user.joined || 'Recently'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            <span className="text-secondary">Saved Universities</span>
                            <span style={{ fontWeight: 500 }}>{savedUniversities.length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span className="text-secondary">Reviews Written</span>
                            <span style={{ fontWeight: 500 }}>{user.reviews || 0}</span>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="btn-outline" style={{ width: '100%', color: 'var(--error, #e53e3e)', borderColor: 'var(--error, #e53e3e)' }}>
                        Log Out
                    </button>
                </div>

                {/* Profile Content */}
                <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Saved Universities</h3>

                    {savedData.length === 0 ? (
                        <div style={{ background: "var(--white)", padding: "2rem", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No saved universities yet</h4>
                            <p className="text-secondary" style={{ marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                                When you find universities you're interested in, you can save them to compare later.
                            </p>
                            <Link to="/universities" className="btn-black">Browse Universities</Link>
                        </div>
                    ) : (
                        <div className="universities-grid">
                            {savedData.map(uni => (
                                <UniversityCard key={uni._id} uni={uni} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Profile;
