const mongoose = require('mongoose');
const { Decimal128 } = mongoose.Schema.Types;

const transactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  amount: {
    type: Decimal128,
    required: true
  },
  idempotencyKey: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Adicionando um índice composto para os campos sender e recipient
transactionSchema.index({ sender: 1, recipient: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
