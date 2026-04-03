const mongoose = require('mongoose');
const fs = require('fs');
const University = require('./models/University');
require('dotenv').config();

// Default to local MongoDB if not provided
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/university_platform';

// Helper to determine typical engineering exam requirements
const getExamRequirement = (ranking, type) => {
    if (ranking <= 25 && type === "Public") return "JEE Advanced";
    if (ranking <= 50 && type === "Public") return "JEE Main";
    if (type === "Private") return "Institute Specific";
    return "State CET";
};

// Helper to determine rough rank requirements based on overall ranking
const getRankRequirement = (ranking) => {
    if (ranking <= 5) return "Top 500";
    if (ranking <= 15) return "Top 2000";
    if (ranking <= 25) return "Top 5000";
    if (ranking <= 40) return "Top 15000";
    return "Top 30000";
};

// Helper to fill in missing fees and placement
const getEstimatedFees = (type) => type === 'Private' ? "15L - 25L" : "1L - 3L";
const getEstimatedPlacement = (ranking) => {
    if (ranking <= 10) return "15-25 LPA";
    if (ranking <= 25) return "10-15 LPA";
    return "6-10 LPA";
};
const getEstimatedPlacementPercentage = (ranking) => {
    return Math.max(75, 100 - parseInt(ranking)) + "%";
};

// Helper for generating fallback branch cutoffs computationally
const getEstimatedBranches = (ranking, type) => {
    // A more realistic estimation for colleges missing explicit branch data:
    // For top 100 colleges, scale linearly but not too aggressively.
    // For local/private colleges, cap the base cutoff differently to remain somewhat realistic.
    
    let baseCutoff = 0;
    
    if (ranking <= 50) {
        baseCutoff = ranking * 150;
    } else if (ranking <= 200) {
        baseCutoff = 5000 + (ranking - 50) * 200; 
    } else {
        baseCutoff = 35000 + (ranking - 200) * 100;
    }

    if (type === "Private") {
         // Private colleges typically have lower base rank requirements for average colleges
        baseCutoff *= 1.2;
    }

    // Ensure the cutoff rank is a string to match the model
    return [
        { name: 'Computer Science and Engineering', cutoffRank: String(Math.floor(baseCutoff + 500)) },
        { name: 'Information Technology', cutoffRank: String(Math.floor(baseCutoff * 1.1 + 1000)) },
        { name: 'Electronics and Communication', cutoffRank: String(Math.floor(baseCutoff * 1.3 + 1500)) },
        { name: 'Electrical Engineering', cutoffRank: String(Math.floor(baseCutoff * 1.5 + 2500)) },
        { name: 'Mechanical Engineering', cutoffRank: String(Math.floor(baseCutoff * 2.0 + 4000)) },
        { name: 'Civil Engineering', cutoffRank: String(Math.floor(baseCutoff * 2.5 + 6000)) },
        { name: 'Chemical Engineering', cutoffRank: String(Math.floor(baseCutoff * 2.2 + 5000)) }
    ];
};

async function seedDatabase() {
    try {
        console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB.');

        // 1. Read static JSON file
        const dataPath = './src/data/universities.json';
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const universitiesData = JSON.parse(rawData);

        console.log(`Read ${universitiesData.length} universities from static JSON.`);

        // 2. Clear existing data in the DB to avoid duplicates during seeding
        await University.deleteMany({});
        console.log('Cleared existing data in University collection.');

        // 3. Process data and fill in missing fields computationally
        const enrichedData = universitiesData.map(uni => {
            return {
                ...uni,
                fees: uni.fees || getEstimatedFees(uni.type),
                average_placement: uni.average_placement || getEstimatedPlacement(uni.ranking),
                placement_percentage: uni.placement_percentage || getEstimatedPlacementPercentage(uni.ranking),
                required_exam: uni.required_exam || getExamRequirement(uni.ranking, uni.type),
                average_rank_required: uni.average_rank_required || getRankRequirement(uni.ranking),
                branches: uni.branches || getEstimatedBranches(uni.ranking, uni.type || 'Public'),
                description: uni.description || `${uni.name} is a known university located in ${uni.location}.`,
                type: uni.type || 'Public' // Default fallback
            };
        });

        // 4. Insert into MongoDB
        await University.insertMany(enrichedData);
        console.log(`Successfully seeded ${enrichedData.length} records into the database!`);

    } catch (error) {
        console.error('Error seeding the database: ', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

seedDatabase();
