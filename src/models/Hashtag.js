const mongoose = require('mongoose');

const HashtagSchema = new mongoose.Schema({
    theme: String,
    description: String,
})

module.exports = mongoose.model('Hashtag', HashtagSchema);