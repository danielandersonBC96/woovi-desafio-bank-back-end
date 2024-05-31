const jwt = require('jsonwebtoken');
const User = require('../Models/userModels1');
const Account = require('../Models/accontModels1');
const Transaction = require('../Models/transactionModels');

const transferResolver = {
  Mutation: {
    async transfer(parent, { input }, context) {
      try {
        const { senderAccountNumber, receiverAccountNumber, amount } = input;

        // Verificar a autenticação do usuário
        const token = context.headers.authorization;
        if (!token) {
          throw new Error('Authentication required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderAccount = await Account.findOne({ accountNumber: senderAccountNumber });

        if (!senderAccount) {
          throw new Error('Sender account not found');
        }

        if (senderAccount.userId.toString() !== decoded.userId) {
          throw new Error('Not authorized to transfer from this account');
        }

        // Verificar se o saldo é suficiente
        if (senderAccount.balance < amount) {
          throw new Error('Insufficient balance');
        }

        const receiverAccount = await Account.findOne({ accountNumber: receiverAccountNumber });
        if (!receiverAccount) {
          throw new Error('Receiver account not found');
        }

        // Executar o cálculo do saldo
        senderAccount.balance -= amount;
        receiverAccount.balance += amount;

        // Atualizar as contas no banco de dados
        await senderAccount.save();
        await receiverAccount.save();

        // Criar uma transação com status
        const newTransaction = await Transaction.create({
          senderAccountNumber,
          receiverAccountNumber,
          amount,
          status: 'completed',
        });

        // Retornar a transação
        return {
          transaction: newTransaction,
        };
      } catch (error) {
        // Lançar uma exceção indicando que houve uma falha na transferência
        throw new Error('Failed to complete the transfer');
      }
    },
  },
};

module.exports = transferResolver;
