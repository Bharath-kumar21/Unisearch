# 🎓 UniSearch India — University Discovery Platform

A full-stack web application that helps Indian students discover, compare, and shortlist engineering universities based on entrance exam type, rank, location, fees, and more. Built with **React**, **Node.js/Express**, and **MongoDB**.

> **Live URL (GitHub Pages — frontend only):** [https://Bharath-kumar21.github.io/university-platform](https://Bharath-kumar21.github.io/university-platform)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Folder Structure](#-folder-structure)
- [Data Model](#-data-model)
- [API Endpoints](#-api-endpoints)
- [Pages & UI Walkthrough](#-pages--ui-walkthrough)
- [Getting Started](#-getting-started)
- [Database Seeding](#-database-seeding)
- [Updating Branch Cutoff Ranks](#-updating-branch-cutoff-ranks)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Scripts Reference](#-scripts-reference)

---

## ✨ Features

| Category | Details |
|---|---|
| **Rank-Based Search** | Enter your entrance exam type (JEE Main, JEE Advanced, CUET, State CET, Institute Specific) and rank to find universities you qualify for |
| **Advanced Filtering** | Filter by exam type, rank, state/city, institution type (Public/Private), NAAC grade, and fees range |
| **University Listings** | Paginated (9 per page), sortable by ranking or name, with text search across name and location |
| **University Details** | Detailed page for each university showing NIRF ranking, fees, placements, admission requirements, and branch-wise cutoff ranks |
| **Side-by-Side Comparison** | Compare up to 3 universities across 8 criteria including location, NAAC grade, NIRF ranking, fees, placement %, avg package, established year, required exam, and avg rank required |
| **Analytics Dashboard** | Interactive charts (Bar, Pie, Scatter) powered by Recharts — state distribution, NAAC accreditation breakdown, and fees vs. placement correlation |
| **Save & Shortlist** | Bookmark universities (persisted in localStorage) and view them on your profile |
| **User Authentication** | JWT-based signup/login with bcrypt password hashing, protected routes, and token auto-refresh on page load |
| **User Profile** | View account details (name, email, join date, review count), manage saved universities, and log out |
| **Global Search** | Instant search from the navbar — press Enter to navigate to filtered university results |
| **State CET Sub-Filters** | When "State CET" exam is selected, a nested filter appears to narrow down by specific state (Maharashtra, West Bengal, Tamil Nadu, etc.) |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| React Router DOM v6 | Client-side routing with protected routes |
| Recharts | Data visualization (Bar, Pie, Scatter charts) |
| Vanilla CSS | Custom styling with CSS variables design system |
| PropTypes | Component prop validation |
| localStorage | Persisting saved universities and auth tokens |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose 9 | Database and ODM |
| bcryptjs | Password hashing |
| jsonwebtoken (JWT) | Stateless authentication |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable management |

### Tooling
| Technology | Purpose |
|---|---|
| Create React App | Project scaffolding and build tooling |
| concurrently | Run server + client simultaneously |
| gh-pages | GitHub Pages deployment |
| xlsx | Excel file processing (for data import) |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER (React SPA)                 │
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │AuthContext│  │UniversityCtx │  │  SavedContext    │   │
│  │  (JWT)   │  │ (API fetch)  │  │  (localStorage)  │   │
│  └────┬─────┘  └──────┬───────┘  └────────┬─────────┘   │
│       │               │                   │             │
│  ┌────▼───────────────▼───────────────────▼──────────┐  │
│  │                   Pages                           │  │
│  │  Home │ Universities │ Details │ Compare │ etc.   │  │
│  └───────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP (fetch)
                        ▼
┌───────────────────────────────────────────────────────┐
│              EXPRESS SERVER (port 5000)                │
│                                                       │
│  POST /api/auth/signup       — Register new user      │
│  POST /api/auth/login        — Authenticate user      │
│  GET  /api/users/profile     — Get user profile (JWT) │
│  GET  /api/universities      — List all universities  │
│  GET  /api/universities/:id  — Single university      │
└───────────────────────┬───────────────────────────────┘
                        │ Mongoose
                        ▼
┌───────────────────────────────────────────────────────┐
│                    MONGODB                            │
│                                                       │
│  Collections:  users  │  universities                 │
└───────────────────────────────────────────────────────┘
```

---

## 📂 Folder Structure

```
university-platform/
├── models/                          # Mongoose schema definitions
│   ├── University.js                #   University model (name, location, ranking, fees, branches, etc.)
│   └── User.js                      #   User model (name, email, hashed password, join date, reviews)
├── public/                          # Static assets served by CRA
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── Navbar.js / Navbar.css   #   Top navigation bar with global search
│   │   ├── Footer.js / Footer.css   #   Site footer with links and contact info
│   │   ├── UniversityCard.js/.css   #   University listing card with save button
│   │   └── SearchBar.js            #   Search bar component
│   ├── context/                     # React Context providers (global state)
│   │   ├── AuthContext.js           #   Authentication state (user, token, login, signup, logout)
│   │   ├── UniversityContext.js     #   University data fetching and caching
│   │   └── SavedContext.js          #   Saved/bookmarked university IDs (localStorage)
│   ├── data/                        # Static/source data files
│   │   ├── universities.json        #   Master JSON dataset (~440KB, all universities)
│   │   └── University-*.xlsx        #   Excel source files for data import
│   ├── pages/                       # Route-level page components
│   │   ├── Home.js / Home.css       #   Landing page with exam + rank search
│   │   ├── Universities.js/.css     #   Filterable, paginated university listing
│   │   ├── UniversityDetails.js     #   Single university detail view
│   │   ├── Compare.js / Compare.css #   Side-by-side comparison (up to 3)
│   │   ├── Dashboard.js            #   Analytics dashboard with charts
│   │   ├── Login.js                 #   Login form
│   │   ├── SignUp.js                #   Registration form
│   │   └── Profile.js              #   User profile with saved universities
│   ├── services/
│   │   └── api.js                   #   API service layer (placeholder)
│   ├── App.js                       #   Root component with routing and context providers
│   ├── App.css                      #   Global styles and CSS variables
│   └── index.js                     #   React entry point
├── server.js                        # Express API server
├── seed.js                          # Database seeding script
├── update_ranks.js                  # Utility to update branch cutoff ranks
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

---

## 📊 Data Model

### University Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | ✅ | Full university name |
| `location` | String | ✅ | City, State format |
| `ranking` | Number | ✅ | NIRF ranking |
| `fees` | String | ❌ | Annual fees (e.g., `"2.5L"`, `"80K"`) |
| `average_placement` | String | ❌ | Average placement package (e.g., `"18 LPA"`) |
| `placement_percentage` | String | ❌ | Placement rate (e.g., `"95%"`) |
| `website` | String | ❌ | Official university website URL |
| `established` | Number | ❌ | Year established |
| `type` | String | ❌ | `"Public"` or `"Private"` |
| `required_exam` | String | ❌ | Required entrance exam (JEE Advanced, JEE Main, CUET, State CET, Institute Specific) |
| `average_rank_required` | String | ❌ | Typical rank needed (e.g., `"Top 2500"`) |
| `branches` | Array | ❌ | List of `{ name, cutoffRank }` objects |

### User Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | ✅ | User's display name |
| `email` | String | ✅ | Unique, lowercase, trimmed |
| `password` | String | ✅ | bcrypt-hashed password |
| `joined` | String | ❌ | Auto-generated join date (e.g., `"Apr 2026"`) |
| `reviews` | Number | ❌ | Number of reviews written (default: 0) |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | `{ name, email, password }` | `{ message, token, user }` |
| `POST` | `/api/auth/login` | ❌ | `{ email, password }` | `{ message, token, user }` |
| `GET` | `/api/users/profile` | ✅ Bearer | — | User object (without password) |

### Universities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/universities` | ❌ | Returns all universities sorted by ranking (ascending) |
| `GET` | `/api/universities/:id` | ❌ | Returns a single university by MongoDB `_id` |

### Authentication Flow

1. User signs up or logs in → server returns a JWT token (24h expiry)
2. Token is stored in `localStorage`
3. On page load, `AuthContext` reads the token and fetches `/api/users/profile` to restore the session
4. Protected routes (e.g., `/profile`) redirect to `/login` if no valid session exists
5. Logout clears the token from `localStorage` and resets state

---

## 📄 Pages & UI Walkthrough

### 1. Home Page (`/`)
- **Hero section** with headline and a search form
- **Two inputs:** Exam Type dropdown (JEE Main, JEE Advanced, CUET, State CET, Institute Specific) and Rank number field
- **"Find Universities" button** navigates to the Universities page with pre-applied filters
- **"How it works" section** with 3 steps: Select Exam → Enter Rank → Explore

### 2. Universities Page (`/universities`)
- **Left sidebar** with multi-select checkbox filters:
  - Your Rank (numeric input)
  - Exam Type (with nested State CET state selection)
  - State / City (16 states)
  - Institution Type (Public / Private)
  - NAAC Grade (A++, A+, A)
  - Fees Range (Under ₹1L, ₹1L-₹3L, ₹3L-₹5L, Above ₹5L)
- **Main content area:**
  - Full-text search bar (name or location)
  - Results count with sort dropdown (Ranking / Name)
  - 3-column grid of `UniversityCard` components
  - Pagination with page numbers and prev/next buttons (9 items per page)

### 3. University Details Page (`/university/:id`)
- **Two-column layout:**
  - Left: Key Information (NIRF ranking, annual fees, average placement, placement %)
  - Right: Admission Requirements (required exam, avg rank required) + Branch Cutoffs table
- **Visit Official Website** button (external link)
- University description, location, established year, and type

### 4. Compare Page (`/compare`)
- **Table-based comparison** of up to 3 universities
- Click "Add University" to open a searchable dropdown
- Compares: Location, NAAC Grade, NIRF Ranking, Annual Fees, Placement %, Avg Package, Established, Required Exam, Avg Rank Required
- Remove a university with the × button

### 5. Analytics Dashboard (`/dashboard`)
- **Summary stats:** Total Ranked Universities, States Covered, Avg Top 10 Placement
- **Bar Chart:** Universities per State (Top 10 states)
- **Pie Chart (Donut):** NAAC Accreditation distribution (A++, A+, A)
- **Scatter Chart:** Fees vs Placement Probability — shows that higher fees don't always mean better placements
- **CTA section** linking to Compare and Search Database

### 6. Login Page (`/login`)
- Email and password form
- Error handling for invalid credentials
- Link to sign up

### 7. Sign Up Page (`/signup`)
- Name, email, and password form
- Password validation
- Link to log in

### 8. Profile Page (`/profile`) — *Protected Route*
- **Profile sidebar:** User avatar, name, email, join date, saved universities count, reviews count, and logout button
- **Saved Universities grid:** Displays bookmarked universities as cards, or an empty state with a link to browse

### Shared Components
- **Navbar:** Logo, navigation links (Home, Universities, Compare, Analytics), global search bar (Enter to search), and auth actions (Login/Sign Up or Profile/Log Out)
- **Footer:** Brand description, Explore links, Resources links, and contact info
- **UniversityCard:** Card with university name, location, NAAC badge, fees, save/bookmark toggle, "View Details" and "Website" buttons

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** (local instance or MongoDB Atlas cloud)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Bharath-kumar21/university-platform.git
cd university-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables (optional — defaults to localhost)
#    Create a .env file if using MongoDB Atlas:
echo "MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/university_platform" > .env

# 4. Seed the database (first time only)
node seed.js

# 5. Start the application (runs both server and client concurrently)
npm start
```

### After Starting

| Service | URL |
|---|---|
| React Frontend | [http://localhost:3000](http://localhost:3000) |
| Express API Server | [http://localhost:5000](http://localhost:5000) |

The app opens in your browser automatically. Both the server and client run concurrently via the `concurrently` package.

---

## 🌱 Database Seeding

The `seed.js` script reads from `src/data/universities.json` and populates the MongoDB `universities` collection with enriched data.

```bash
node seed.js
```

**What it does:**
1. Connects to MongoDB (uses `MONGO_URI` env var or defaults to `mongodb://localhost:27017/university_platform`)
2. Reads the static JSON dataset from `src/data/universities.json`
3. **Clears** the existing `universities` collection to avoid duplicates
4. Enriches records with computed fallback values for any missing fields:
   - `fees` — estimated based on institution type (Public: ₹1L-3L, Private: ₹15L-25L)
   - `average_placement` — estimated based on ranking tier
   - `placement_percentage` — computed as `max(75, 100 - ranking)%`
   - `required_exam` — derived from ranking + type (Top 25 Public → JEE Advanced, etc.)
   - `average_rank_required` — derived from ranking tier
   - `branches` — 7 default engineering branches with cutoffs scaled by ranking
5. Inserts all enriched records into MongoDB

---

## 📈 Updating Branch Cutoff Ranks

The `update_ranks.js` script updates branch-wise cutoff ranks for top universities using verified JEE Advanced/Main data.

```bash
node update_ranks.js
```

**Currently updates:** IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur, IIT Roorkee, IIT Guwahati, IIT Hyderabad, IIT BHU Varanasi, NIT Trichy, NIT Karnataka, NIT Rourkela, and Jadavpur University.

> **Note:** This script updates the local `src/data/universities.json` file. Run `node seed.js` afterwards to push the changes to MongoDB.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (optional):

```env
MONGO_URI=mongodb://localhost:27017/university_platform
```

| Variable | Default | Description |
|---|---|---|
| `MONGO_URI` | `mongodb://localhost:27017/university_platform` | MongoDB connection string |

> **Note:** The JWT secret key is currently hardcoded in `server.js` for development. For production, move it to an environment variable.

---

## 🌐 Deployment

### GitHub Pages (Frontend Only)

```bash
npm run deploy
```

This runs `npm run build` (predeploy hook) and then publishes the `build/` folder to GitHub Pages. The `homepage` field in `package.json` is set to `https://Bharath-kumar21.github.io/university-platform`.

> **Important:** GitHub Pages serves only the static frontend. You need a separately hosted backend (e.g., Render, Railway, Vercel Serverless) for the Express API and MongoDB to work in production.

### Full-Stack Deployment

For a fully functional deployment, you need:
1. **Frontend:** Deploy the `build/` folder to any static hosting (Vercel, Netlify, GitHub Pages)
2. **Backend:** Deploy `server.js` to a Node.js hosting service (Render, Railway, Heroku)
3. **Database:** Use MongoDB Atlas for a cloud-hosted database
4. **Update API URLs:** Change `http://localhost:5000` references in `AuthContext.js` and `UniversityContext.js` to your production API URL

---

## 📋 Scripts Reference

| Command | Description |
|---|---|
| `npm start` | Starts both the Express server and React dev server concurrently |
| `npm run server` | Starts only the Express API server (`node server.js`) |
| `npm run client` | Starts only the React development server |
| `npm run build` | Creates an optimized production build in `build/` |
| `npm test` | Runs the test suite with Jest |
| `npm run deploy` | Builds and deploys the frontend to GitHub Pages |
| `node seed.js` | Seeds the MongoDB database from the JSON dataset |
| `node update_ranks.js` | Updates branch cutoff ranks in the local JSON file |

---

## 📝 License

© 2026 UniSearch India. All rights reserved.
