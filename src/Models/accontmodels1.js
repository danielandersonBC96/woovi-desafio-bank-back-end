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
        type: mongoose.Schema.Types.Decimal128, // Certifique-se de que está correto
        default: 0.0
    }
});

// Verifica se o modelo já foi definido
const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);

module.exports = Account;
