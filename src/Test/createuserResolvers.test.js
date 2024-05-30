const { User } = require('../Models/userModels1.js');
const { Account } = require('../Models/accontmodels1.js');
const { loginresolvers } = require('../resolvers/loginResolvers');

jest.mock('../Models/userModels1.js');
jest.mock('../Models/accontmodels1.js');

describe('loginResolvers', () => {
  describe('Mutation', () => {
    describe('createUserWithAccount', () => {
      it('should create a user and account successfully with valid input', async () => {
        const input = {
          firstName: 'John',
          email: 'john@example.com',
          cpfCnpj: '12345678900',
          password: 'password123',
        };

        const mockUser = {
          id: 'user123',
          ...input,
          save: jest.fn().mockResolvedValue(true),
        };

        const mockAccount = {
          id: 'account123',
          userId: 'user123',
          accountNumber: '1234567890',
          balance: 0,
          save: jest.fn().mockResolvedValue(true),
        };

        User.findOne = jest.fn().mockResolvedValue(null);
        User.create = jest.fn().mockResolvedValue(mockUser);
        Account.findOne = jest.fn().mockResolvedValue(null);
        Account.create = jest.fn().mockResolvedValue(mockAccount);

        const result = await loginresolvers.Mutation.createUserWithAccount(null, { input }, {});

        expect(User.findOne).toHaveBeenCalledWith({ email: input.email });
        expect(User.create).toHaveBeenCalledWith(input);
        expect(Account.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        expect(Account.create).toHaveBeenCalledWith({
          userId: 'user123',
          accountNumber: expect.any(String),
          balance: 0,
        });
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual(mockUser);
      });

      it('should throw error if user with the same email already exists', async () => {
        const input = {
          firstName: 'John',
          email: 'john@example.com',
          cpfCnpj: '12345678900',
          password: 'password123',
        };

        const mockUser = {
          id: 'user123',
          ...input,
        };

        User.findOne = jest.fn().mockResolvedValue(mockUser);

        await expect(loginresolvers.Mutation.createUserWithAccount(null, { input }, {}))
          .rejects
          .toThrow('User with this email already exists');
      });

      it('should throw error if account already exists for the user', async () => {
        const input = {
          firstName: 'John',
          email: 'john@example.com',
          cpfCnpj: '12345678900',
          password: 'password123',
        };

        const mockUser = {
          id: 'user123',
          ...input,
          save: jest.fn().mockResolvedValue(true),
        };

        const mockAccount = {
          id: 'account123',
          userId: 'user123',
        };

        User.findOne = jest.fn().mockResolvedValue(null);
        User.create = jest.fn().mockResolvedValue(mockUser);
        Account.findOne = jest.fn().mockResolvedValue(mockAccount);

        await expect(loginresolvers.Mutation.createUserWithAccount(null, { input }, {}))
          .rejects
          .toThrow('User already has an account');
      });

      it('should throw error if creation of user or account fails', async () => {
        const input = {
          firstName: 'John',
          email: 'john@example.com',
          cpfCnpj: '12345678900',
          password: 'password123',
        };

        User.findOne = jest.fn().mockResolvedValue(null);
        User.create = jest.fn().mockRejectedValue(new Error('Failed to create user'));

        await expect(loginresolvers.Mutation.createUserWithAccount(null, { input }, {}))
          .rejects
          .toThrow('Failed to create user with account');
      });
    });
  });
});
