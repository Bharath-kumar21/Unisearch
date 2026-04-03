const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    ranking: {
        type: Number,
        required: true
    },
    fees: {
        type: String, // String to handle values like "2.5L"
        required: false
    },
    average_placement: {
        type: String, // String to handle values like "18 LPA"
        required: false
    },
    placement_percentage: {
        type: String, // String to handle values like "95%"
        required: false
    },
    website: {
        type: String,
        required: false
    },

    established: {
        type: Number,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    required_exam: {
        type: String,
        required: false
    },
    average_rank_required: {
        type: String, // e.g., "Top 2500"
        required: false
    },
    branches: [{
        name: { type: String, required: true },
        cutoffRank: { type: String, required: true }
    }]
});

module.exports = mongoose.model('University', universitySchema);
