const mongoose = require('mongoose');

// TODO: Sanitize and validate schema
const schema = new mongoose.Schema({
    franchises: [mongoose.Schema.Types.ObjectId],
    locations: [mongoose.Schema.Types.ObjectId], 
    name: String, 
    rating: Number, //skip
    reviews: [String], //skip
    reviews_count: Number, //skip
    rooms: [mongoose.Schema.Types.ObjectId],
    slug: String,
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

module.exports = mongoose.model('Company', schema);