
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
      type: mongoose.Decimal128, // Corrigido para mongoose.Decimal128
      default: 0.0
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
