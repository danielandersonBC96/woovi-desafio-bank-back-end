const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number, // Corrigido para o tipo Number para representar valores decimais
        default: 0.0
    }
});

// Verifica se o modelo já foi definido
const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);

module.exports = Account;
