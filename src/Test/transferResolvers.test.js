const { transferResolvers } = require('../resolvers/transferResolvers');
const { Account } = require('../Models/accontmodels1.js');
const { Transaction } = require('../Models/TransactionModels');

jest.mock('../Models/accontmodels1.js');
jest.mock('../Models/TransactionModels');

describe('transferResolvers', () => {
  describe('transferMoney', () => {
    it('should transfer money successfully', async () => {
      // Mock accounts
      const senderAccount = { _id: 'sender123', balance: 1000, save: jest.fn() };
      const receiverAccount = { _id: 'receiver123', balance: 500, save: jest.fn() };
      
      // Mock findById
      Account.findById.mockImplementation((id) => {
        if (id === 'sender123') return senderAccount;
        if (id === 'receiver123') return receiverAccount;
        return null;
      });

      // Mock transaction save
      const mockTransactionSave = jest.fn();
      Transaction.prototype.save = mockTransactionSave;

      // Call resolver
      const result = await transferResolvers.Mutation.transferMoney(null, {
        senderId: 'sender123',
        receiverId: 'receiver123',
        value: 200,
      }, {});

      // Assert results
      expect(senderAccount.balance).toBe(800);
      expect(receiverAccount.balance).toBe(700);
      expect(senderAccount.save).toHaveBeenCalled();
      expect(receiverAccount.save).toHaveBeenCalled();
      expect(mockTransactionSave).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Money transferred successfully'
      });
    });

    it('should throw error if sender or receiver account not found', async () => {
      // Mock findById
      Account.findById.mockImplementation(() => null);

      await expect(transferResolvers.Mutation.transferMoney(null, {
        senderId: 'invalidSenderId',
        receiverId: 'invalidReceiverId',
        value: 200,
      }, {})).rejects.toThrow('Sender or receiver account not found');
    });

    it('should throw error if insufficient funds', async () => {
      // Mock accounts
      const senderAccount = { _id: 'sender123', balance: 100, save: jest.fn() };
      const receiverAccount = { _id: 'receiver123', balance: 500, save: jest.fn() };

      // Mock findById
      Account.findById.mockImplementation((id) => {
        if (id === 'sender123') return senderAccount;
        if (id === 'receiver123') return receiverAccount;
        return null;
      });

      await expect(transferResolvers.Mutation.transferMoney(null, {
        senderId: 'sender123',
        receiverId: 'receiver123',
        value: 200,
      }, {})).rejects.toThrow('Insufficient funds');
    });
  });
});
