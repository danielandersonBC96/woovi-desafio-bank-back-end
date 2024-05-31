const jwt = require('jsonwebtoken');
const loginResolvers = require('../resolvers/loginrResolvers.js');
const User = require('../Models/userModels1.js');
const Account = require('../Models/accontModels1.js');

jest.mock('jsonwebtoken');
jest.mock('../Models/userModels1.js');
jest.mock('../Models/accontModels1.js');

describe('loginResolvers', () => {
  describe('Mutation', () => {
    describe('login', () => {
      it('should login successfully with valid credentials', async () => {
        const mockUser = {
          id: 'user123',
          email: 'test@example.com',
          validatePassword: jest.fn().mockReturnValue(true),
        };

        User.findOne.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('mockToken');

        const context = {
          res: {
            cookie: jest.fn(),
          },
        };

        const result = await loginResolvers.Mutation.login(null, { email: 'test@example.com', password: 'password' }, context);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(mockUser.validatePassword).toHaveBeenCalledWith('password');
        expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        expect(context.res.cookie).toHaveBeenCalledWith('token', 'mockToken', { httpOnly: true, maxAge: 3600000 });
        expect(result).toEqual({
          success: true,
          message: 'Login successful',
          user: mockUser,
        });
      });

      it('should throw error with invalid credentials', async () => {
        User.findOne.mockResolvedValue(null);

        await expect(loginResolvers.Mutation.login(null, { email: 'invalid@example.com', password: 'password' }, {}))
          .rejects
          .toThrow('Invalid email or password');
      });
    });

    describe('createUserWithAccount', () => {
      it('should create a new user and account successfully', async () => {
        const mockInput = {
          firstName: 'John',
          email: 'john@example.com',
          cpfCnpj: '123456789',
          password: 'password',
        };

        const mockUser = {
          id: 'user123',
          ...mockInput,
        };

        const mockAccount = {
          id: 'account123',
          userId: mockUser.id,
          accountNumber: '1234567890',
          balance: 0,
        };

        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(mockUser);
        Account.findOne.mockResolvedValue(null);
        Account.create.mockResolvedValue(mockAccount);

        const result = await loginResolvers.Mutation.createUserWithAccount(null, { input: mockInput }, {});

        expect(User.findOne).toHaveBeenCalledWith({ email: mockInput.email });

        const expectedUser = {
          firstName: mockInput.firstName,
          email: mockInput.email,
          cpfCnpj: mockInput.cpfCnpj,
          password: mockInput.password,
        };
        expect(User.create).toHaveBeenCalledWith(expect.objectContaining(expectedUser));

        expect(Account.findOne).toHaveBeenCalledWith({ userId: mockUser.id });
        expect(Account.create).toHaveBeenCalledWith({
          userId: mockUser.id,
          accountNumber: expect.any(String),
          balance: 0,
        });
        expect(result).toEqual(mockUser);
      });

      it('should throw error if user already exists', async () => {
        const mockInput = {
          firstName: 'John',
          email: 'john@example.com',
          cpfCnpj: '123456789',
          password: 'password',
        };

        const mockExistingUser = {
          id: 'user123',
          ...mockInput,
        };

        User.findOne.mockResolvedValue(mockExistingUser);

        await expect(loginResolvers.Mutation.createUserWithAccount(null, { input: mockInput }, {}))
          .rejects
          .toThrow('User with this email already exists');
      });

      it('should throw error if account already exists', async () => {
        const mockInput = {
          firstName: 'John',
          email: 'john@example.com',
          cpfCnpj: '123456789',
          password: 'password',
        };

        const mockUser = {
          id: 'user123',
          ...mockInput,
        };

        const mockExistingAccount = {
          id: 'account123',
          userId: mockUser.id,
        };

        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(mockUser);
        Account.findOne.mockResolvedValue(mockExistingAccount);

        await expect(loginResolvers.Mutation.createUserWithAccount(null, { input: mockInput }, {}))
          .rejects
          .toThrow('User already has an account');
      });
    });
  });
});
