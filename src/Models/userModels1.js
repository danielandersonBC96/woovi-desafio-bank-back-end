const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cpfCnpj: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    }
});

// Antes de salvar, criptografa a senha e armazena o hash
userSchema.pre('save', async function(next) {
    if (!this.isModified('passwordHash')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.passwordHash, 10);
        this.passwordHash = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
