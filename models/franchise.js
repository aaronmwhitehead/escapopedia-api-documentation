const mongoose = require('mongoose');

// TODO: Sanitize and validate schema
const schema = new mongoose.Schema({
    address: String,
    company: mongoose.Schema.Types.ObjectId,
    lat: Number, 
    lon: Number,
    location: mongoose.Schema.Types.ObjectId,
    phone: String,
    rooms: [mongoose.Schema.Types.ObjectId],
    website: String
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

module.exports = mongoose.model('Franchise', schema);