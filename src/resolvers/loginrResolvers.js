const jwt = require('jsonwebtoken');
const User = require('../Models/userModels1.js');
const Account = require('../Models/accontModels1.js');

const loginResolvers = {
  Mutation: {
    async login(parent, { email, password }, context) {
      const user = await User.findOne({ email });
      if (!user || !user.validatePassword(password)) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      context.res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

      return {
        success: true,
        message: 'Login successful',
        user,
      };
    },

    async createUserWithAccount(parent, { input }, context) {
      const { email, cpfCnpj } = input;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const newUser = await User.create(input);

      const existingAccount = await Account.findOne({ userId: newUser.id });
      if (existingAccount) {
        throw new Error('User already has an account');
      }

      const newAccount = await Account.create({
        userId: newUser.id,
        accountNumber: '1234567890', // Número da conta fictício
        balance: 0,
      });

      return newUser;
    },
  },
};

module.exports = loginResolvers;
