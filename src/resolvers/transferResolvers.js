const Account = require('../Models/accontmodels1.js');
const Transaction = require('../Models/TransactionModels');

const transferResolvers = {
  Mutation: {
    async transferMoney(parent, { senderId, receiverId, value }, context) {
      try {
        // Encontrar contas
        const senderAccount = await Account.findById(senderId);
        const receiverAccount = await Account.findById(receiverId);

        if (!senderAccount || !receiverAccount) {
          throw new Error('Sender or receiver account not found');
        }

        if (senderAccount.balance < value) {
          throw new Error('Insufficient funds');
        }

        // Atualizar saldos
        senderAccount.balance -= value;
        receiverAccount.balance += value;

        // Salvar contas
        await senderAccount.save();
        await receiverAccount.save();

        // Registrar a transação
        const transaction = new Transaction({
          senderId,
          receiverId,
          value,
        });

        await transaction.save();

        return {
          success: true,
          message: 'Money transferred successfully',
        };
      } catch (error) {
        throw new Error(error.message || 'Failed to transfer money');
      }
    },
  },
};

module.exports = transferResolvers;
