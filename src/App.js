import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Universities from "./pages/Universities";
import UniversityDetails from "./pages/UniversityDetails";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import { SavedProvider } from "./context/SavedContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UniversityProvider } from "./context/UniversityContext";
import './App.css';

// A simple wrapper to protect routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <UniversityProvider>
        <SavedProvider>
          <Router basename="/Unisearch">
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/universities" element={<Universities />} />
                  <Route path="/university/:id" element={<UniversityDetails />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SavedProvider>
      </UniversityProvider>
    </AuthProvider>
  );
}

export default App;
