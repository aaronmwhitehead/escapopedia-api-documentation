const mongoose = require('mongoose');

// TODO: Sanitize and validate schema
const schema = new mongoose.Schema({
    access_token: String, 
    createdAt: { default: Date.now, required: true, type: Date },
    deletedAt: { type: Date },
    email: String,
    name: String, 
    password: String, 
    roles: [String],
    username: String
}, {
        timestamps: true,
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

module.exports = mongoose.model('Account', schema);