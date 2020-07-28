const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    description: String,
    time: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }
});

module.exports = mongoose.model('Message', MessageSchema);