const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    username: String,
    password: String,
    passwordResetToken: {
        type: String,
        select: false,
    }, 
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    state: String,
    country: String,
    picture: String,
    help: {
        type: Boolean,
        default: false,
    }, 
    acceptTerm: {
        type: Boolean,
        default: false,
    },
    statusAccount: {
        type: Number,
        default: 2
    },
    accountToken: {
        type: String,
        select: false,
    },
},  
    { timestamps: true } 
);

/** Função para criar hash da senha. Só irá salvar no banco depois de gerar o hash*/
UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

module.exports = mongoose.model('User', UserSchema);