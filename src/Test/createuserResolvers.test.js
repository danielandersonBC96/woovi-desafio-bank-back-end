
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/userModels1');
const Account = require('../Models/accontModels1');
const createUserWithAccountResolver = require('../resolvers/createuserresolvers');

jest.mock('jsonwebtoken');
jest.mock('../Models/userModels1');
jest.mock('../Models/accontModels1');
jest.mock('bcrypt');

describe('createUserWithAccountResolver', () => {
  describe('Mutation', () => {
    describe('createUserWithAccount', () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should create a user and account successfully with valid input', async () => {
        // Mock input
        const input = {
          firstName: 'John',
          email: 'john@example.com',
          cpfCnpj: '12345678900',
          password: 'password123',
          userId: 'user123', // Adicionando userId à entrada do usuário
        };

        // Mock hashed password
        const hashedPassword = 'encryptedPassword';

        // Mock user creation
        const mockUser = {
          id: 'user123',
          ...input,
        };
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(mockUser);

        // Mock account creation
        const mockAccount = {
          id: 'account123',
          userId: 'user123',
          accountNumber: '1234567890',
          balance: 0,
        };
        Account.findOne.mockResolvedValue(null);
        Account.create.mockResolvedValue(mockAccount);

        // Mock bcrypt hash function
        bcrypt.hash.mockResolvedValue(hashedPassword);

        // Mock JWT token generation
        jwt.sign.mockReturnValue('mockToken');

        // Call the resolver
        const result = await createUserWithAccountResolver.Mutation.createUserWithAccount(null, { input }, {});

        // Assertions
        expect(User.findOne).toHaveBeenCalledWith({ email: input.email });
        expect(User.create).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: input.firstName,
            email: input.email,
            cpfCnpj: input.cpfCnpj,
            password: hashedPassword,
          })
        );
        
        expect(Account.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        expect(Account.create).toHaveBeenCalledWith({
          userId: 'user123',
          accountNumber: expect.any(String),
          balance: 0,
        });
        expect(jwt.sign).toHaveBeenCalledWith({ userId: 'user123' }, process.env.JWT_SECRET);
        expect(result).toEqual({
          token: 'mockToken',
          user: mockUser,
          account: mockAccount,
        });

        // Verifying that bcrypt.hash is called with the correct password
        expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
      });
    });
  });
});
