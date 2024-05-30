const jwt = require('jsonwebtoken');
const { User } = require('../Models/userModels1.js');
const { Account} = require('../Models/accontmodels1.js');

const  loginresolvers = {
  Mutation: {
    async login(parent, { email, password }, context) {
      // Verificar se o usuário existe com o email fornecido
      const user = await User.findOne({ email });

      if (!user || !user.validatePassword(password)) {
        throw new Error('Invalid email or password');
      }

      // Gerar um token de autenticação usando JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Definir o token como um cookie na resposta
      context.res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hora de expiração

      // Retornar os dados do usuário logado
      return {
        success: true,
        message: 'Login successful',
        user}
    },
    async createUserWithAccount(parent, { input }, context) {
      try {
        // Verificar se já existe um usuário com o mesmo email
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        // Criar o usuário
        const newUser = await User.create(input);

        // Verificar se já existe uma conta associada a este usuário
        const existingAccount = await Account.findOne({ userId: newUser.id });
        if (existingAccount) {
          throw new Error('User already has an account');
        }

        // Criar uma nova conta para o usuário
        const newAccount = await Account.create({
          userId: newUser.id,
          accountNumber: generateAccountNumber(),
          balance: 0 // Saldo inicial é zero
        });

        // Relacionar o usuário com a conta
        newUser.accountId = newAccount.id;
        await newUser.save();

        // Retornar o usuário criado com a conta
        return newUser;
      } catch (error) {
        throw new Error('Failed to create user with account');
      }
    },
  },
};

function generateAccountNumber() {
  // Lógica para gerar um número de conta único
  const characters = '0123456789';
  const accountLength = 10; // Tamanho do número da conta

  let accountNumber = '';

  for (let i = 0; i < accountLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    accountNumber += characters[randomIndex];
  }

  return accountNumber;
}

module.exports = loginresolvers  ;
