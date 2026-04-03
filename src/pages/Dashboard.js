import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useUniversity } from "../context/UniversityContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';

function Dashboard() {
  const { universities, loading } = useUniversity();

  const totalUniversities = universities.length;
  const statesSet = new Set(universities.map(u => u.location.split(', ').pop()));
  const totalStates = statesSet.size;

  // 1. Data Prep for State Distribution (Bar Chart)
  const stateData = useMemo(() => {
    const counts = {};
    universities.forEach(u => {
      const state = u.location.split(', ').pop();
      counts[state] = (counts[state] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 states
  }, [universities]);

  // 2. Data Prep for NAAC Grades (Pie Chart) - Deriving from rank for mock data
  const naacData = useMemo(() => {
    const counts = { "A++": 0, "A+": 0, "A": 0 };
    universities.forEach(u => {
      const rank = parseInt(u.ranking);
      if (rank <= 10) counts["A++"]++;
      else if (rank <= 30) counts["A+"]++;
      else counts["A"]++;
    });
    return [
      { name: 'A++', value: counts["A++"] },
      { name: 'A+', value: counts["A+"] },
      { name: 'A', value: counts["A"] }
    ];
  }, [universities]);

  const COLORS = ['#111827', '#4B5563', '#9CA3AF'];

  // 3. Data Prep for Fees vs Placement (Scatter Chart)
  const scatterData = useMemo(() => {
    return universities
      .filter(u => u.fees) // Only those with fees listed
      .map(u => {
        let numericFees = 0;
        if (typeof u.fees === 'string') {
          if (u.fees.endsWith('L')) numericFees = parseFloat(u.fees.replace('L', ''));
          else if (u.fees.endsWith('K')) numericFees = parseFloat(u.fees.replace('K', '')) / 100; // convert to L
        } else {
          numericFees = u.fees / 100000;
        }

        // Mock placement% based on rank to correspond to card ui
        const placementPercent = Math.max(75, 100 - parseInt(u.ranking));

        return {
          name: u.name,
          fees: numericFees,
          placement: placementPercent
        };
      });
  }, [universities]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "3rem" }}>Loading dashboard data...</div>;
  }

  return (
    <div className="container page-layout" style={{ display: 'block' }}>
      <div style={{ padding: "3rem 0", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Analytics Dashboard</h2>
        <p className="text-secondary">Interactive data insights from top Indian institutions</p>
      </div>

      {/* Top Stats */}
      <div className="stats-section" style={{ marginBottom: "3rem" }}>
        <div className="stat-box">
          <div className="icon">🏛️</div>
          <h3>{totalUniversities}</h3>
          <p>Ranked Universities</p>
        </div>
        <div className="stat-box">
          <div className="icon">🗺️</div>
          <h3>{totalStates}</h3>
          <p>States Covered</p>
        </div>
        <div className="stat-box">
          <div className="icon">📈</div>
          <h3>95%</h3>
          <p>Avg Top 10 Placement</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>

        {/* Bar Chart */}
        <div style={{ background: "var(--white)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Universities per State (Top 10)</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ background: "var(--white)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Overall NAAC Accreditation</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={naacData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {naacData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scatter Chart - spans full width at bottom */}
        <div style={{ gridColumn: "1 / -1", background: "var(--white)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
          <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem" }}>Fees vs Placement Probability</h3>
          <p className="text-secondary" style={{ marginBottom: "1.5rem", fontSize: "0.875rem" }}>Higher fees do not always guarantee higher placements</p>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" dataKey="fees" name="Fees" unit="L" label={{ value: 'Annual Fees (in Lakhs)', position: 'insideBottom', offset: -10 }} />
                <YAxis type="number" dataKey="placement" name="Placement" unit="%" domain={[70, 100]} label={{ value: 'Placement %', angle: -90, position: 'insideLeft' }} />
                <ZAxis type="category" dataKey="name" name="University" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Scatter name="Institutions" data={scatterData} fill="#111827" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--bg-secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border-color)" }}>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Begin your custom analysis</h3>
        <div className="flex-center" style={{ gap: "1rem" }}>
          <Link to="/compare" className="btn-black">Compare Specific Universities</Link>
          <Link to="/universities" className="btn-outline" style={{ width: "auto" }}>Search Database</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
