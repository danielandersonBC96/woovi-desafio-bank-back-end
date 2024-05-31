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
    password: { // Corrigido para 'password' em vez de 'passwordHash'
        type: String,
        required: true
    }
});

// Antes de salvar, criptografa a senha e armazena o hash
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10); // Corrigido para 'this.password' em vez de 'this.passwordHash'
        this.password = hashedPassword; // Corrigido para 'this.password' em vez de 'this.passwordHash'
        next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
