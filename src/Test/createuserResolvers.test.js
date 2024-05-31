const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/userModels1');
const Account = require('../Models/accontModels1');
const createUserWithAccountResolver = require('../resolvers/createuserresolvers');

jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../Models/userModels1');
jest.mock('../Models/accontModels1');

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
        };

        // Mock hashed password
        const hashedPassword = 'hashedPassword123';
        bcrypt.hash.mockResolvedValue(hashedPassword);

        // Mock user creation
        const mockUser = {
          id: 'user123',
          firstName: input.firstName,
          email: input.email,
          cpfCnpj: input.cpfCnpj,
          password: hashedPassword,
        };
        User.create.mockResolvedValue(mockUser);

        // Mock account creation
        const mockAccount = {
          id: 'account123',
          userId: 'user123',
          accountNumber: '1234567890',
          balance: 0,
        };
        Account.create.mockResolvedValue(mockAccount);

        // Mock JWT token generation
        const mockToken = 'mockToken';
        jwt.sign.mockReturnValue(mockToken);

        // Call the resolver
        const result = await createUserWithAccountResolver.Mutation.createUserWithAccount(null, { input }, {});

        // Assertions
        expect(User.findOne).toHaveBeenCalledWith({ cpfCnpj: input.cpfCnpj });
        expect(User.create).toHaveBeenCalledWith({
          firstName: input.firstName,
          email: input.email,
          cpfCnpj: input.cpfCnpj,
          password: hashedPassword, // Verifying that the password is encrypted
        });
        // Adjust this part to correctly test the userId passed to Account.findOne
        expect(Account.findOne).toHaveBeenCalledWith({ userId: mockUser.id });
        expect(Account.create).toHaveBeenCalledWith({
          userId: mockUser.id,
          accountNumber: expect.any(String),
          balance: 0,
        });
        expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        expect(result).toEqual({
          token: mockToken,
          user: mockUser,
          account: mockAccount,
        });

        // Verifying that bcrypt.hash is called with the correct password
        expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
      });
    });
  });
});
