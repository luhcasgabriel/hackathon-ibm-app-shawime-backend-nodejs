const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    title: String,
    description: String,
    picture: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    hashtag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hashtag',
        require: true,
    },
    participants: Number,
    ativo: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('Group', GroupSchema);