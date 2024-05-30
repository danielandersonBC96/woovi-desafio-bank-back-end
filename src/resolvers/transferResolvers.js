const { Account } = require('../Models/accontmodels1.js');
const { Transaction } = require('../Models/TransactionModels.js');

const transferResolvers = {
  Mutation: {
    async transferMoney(parent, { senderId, receiverId, value }, context) {
      try {
        // Encontrar as contas do remetente e do destinatário
        const senderAccount = await Account.findById(senderId);
        const receiverAccount = await Account.findById(receiverId);

        if (!senderAccount || !receiverAccount) {
          throw new Error('Sender or receiver account not found');
        }

        // Verificar se o saldo do remetente é suficiente para a transferência
        if (senderAccount.balance < value) {
          throw new Error('Insufficient funds');
        }

        // Atualizar o saldo do remetente e do destinatário
        senderAccount.balance -= value;
        receiverAccount.balance += value;

        // Salvar as alterações
        await senderAccount.save();
        await receiverAccount.save();

        // Salvar a transação no banco de dados
        const transaction = new Transaction({
          senderId,
          receiverId,
          value
        });
        await transaction.save();

        return {
          success: true,
          message: 'Money transferred successfully'
        };
      } catch (error) {
        throw new Error('Failed to transfer money');
      }
    }
  }
};

module.exports = transferResolvers;
