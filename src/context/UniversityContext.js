import React, { createContext, useState, useEffect, useContext } from 'react';

const UniversityContext = createContext();

export const UniversityProvider = ({ children }) => {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Using the same convention as AuthContext to align with package.json proxy or explicit URL
    const API_URL = 'https://unisearch-api.onrender.com';

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await fetch(`${API_URL}/api/universities`);
                if (!response.ok) {
                    throw new Error('Failed to fetch universities data');
                }
                const data = await response.json();
                setUniversities(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching universities:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    // Helper to get a single university by ID (either from state or fetch if deep-linked)
    const getUniversityById = async (id) => {
        // Try finding it in state first
        const found = universities.find(u => u._id === id);
        if (found) return found;

        // If not, fetch from API
        try {
            const response = await fetch(`${API_URL}/api/universities/${id}`);
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error("Error fetching single university:", err);
            return null;
        }
    };

    return (
        <UniversityContext.Provider value={{ universities, loading, error, getUniversityById }}>
            {children}
        </UniversityContext.Provider>
    );
};

export const useUniversity = () => useContext(UniversityContext);
