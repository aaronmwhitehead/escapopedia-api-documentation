const mongoose = require('mongoose');

// TODO: Sanitize and validate schema
const schema = new mongoose.Schema({
    average_rating: Number, //skip
    company: mongoose.Schema.Types.ObjectId,
    description: String,
    difficulty: Number, 
    fear_level: Number, //skip
    franchise: mongoose.Schema.Types.ObjectId,
    images: [String],
    location: mongoose.Schema.Types.ObjectId,
    max_players: Number,
    min_players: Number,
    name: String,
    reviews: [String], //skip
    reviews_count: Number, //skip
    slug: String,
    tags: [String],
    time_limit: Number
}, {
        usePushEach: true
    });

schema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;

        delete ret.__v;
        delete ret._id;

        return ret;
    }
});

module.exports = mongoose.model('Room', schema);