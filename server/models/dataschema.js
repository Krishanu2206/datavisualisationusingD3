const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    end_year: {
        type: String,
        default: "Unknown"
    },
    intensity: {
        type: Number,
        default : 0
    },
    sector: {
        type: String,
        default : "Unknown"
    },
    topic: {
        type: String,
        default : "Unknown"
    },
    insight: {
        type: String,
        default : "Unknown"
    },
    url: {
        type: String,
        default : "Unknown"
    },
    region: {
        type: String,
        default : "Unknown"
    },
    start_year: {
        type: String,
        default: "Unknown"
    },
    impact: {
        type: String,
        default: "Unknown"
    },
    added: {
        type: Date,
    },
    published: {
        type: Date,
    },
    country: {
        type: String,
        default : "Unknown"
    },
    relevance: {
        type: Number,
    },
    pestle: {
        type: String,
        default : "Unknown"
    },
    source: {
        type: String,
        default : "Unknown"
    },
    title: {
        type: String,
        default : "Unknown"
    },
    likelihood: {
        type: Number,
    }
});

const Data = mongoose.model('Data', DataSchema);
module.exports = Data;
