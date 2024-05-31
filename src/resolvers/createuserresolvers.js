const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/userModels1');
const Account = require('../Models/accontModels1');

const createUserWithAccountResolver = {
  Mutation: {
    async createUserWithAccount(parent, { input }, context) {
      try {
        // Verificar se o usuário já existe com o mesmo CPF/CNPJ
        const existingUser = await User.findOne({ cpfCnpj: input.cpfCnpj });
        if (existingUser) {
          throw new Error('User with this CPF/CNPJ already exists');
        }

        // Criptografar a senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Criar um novo usuário no banco de dados
        const newUser = await User.create({
          firstName: input.firstName,
          email: input.email,
          cpfCnpj: input.cpfCnpj,
          password: hashedPassword,
        });

        // Verificar se o usuário já possui uma conta
        const existingAccount = await Account.findOne({ userId: newUser.id });
        if (existingAccount) {
          throw new Error('User already has an account');
        }

        // Criar uma nova conta para o usuário
        const newAccount = await Account.create({
          userId: newUser.id,
          accountNumber: Math.floor(Math.random() * 10000000000).toString(), // Gera um número de conta aleatório
          balance: 0,
        });

        // Gerar um token de autenticação usando JWT
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Retornar o token, usuário e conta registrados
        return {
          token,
          user: newUser,
          account: newAccount,
        };
      } catch (error) {
        // Lançar uma exceção indicando que houve uma falha ao criar o usuário com a conta
        throw new Error('Failed to create user with account');
      }
    },
  },
};

module.exports = createUserWithAccountResolver;



