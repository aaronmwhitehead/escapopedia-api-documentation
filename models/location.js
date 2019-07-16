const mongoose = require('mongoose');

// TODO: Sanitize and validate schema
const schema = new mongoose.Schema({
    city_name: String,
    companies: [mongoose.Schema.Types.ObjectId],
    country: String,
    franchises: [mongoose.Schema.Types.ObjectId],
    rooms: [mongoose.Schema.Types.ObjectId],
    state: String,
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

module.exports = mongoose.model('Location', schema);