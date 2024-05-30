const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../Models/userModels1');

const createUserResolver = {
  Mutation: {
    async registerUser(parent, { input }, context) {
      try {
        // Verificar se o usuário já existe com o mesmo CPF/CNPJ
        const existingUser = await User.findOne({ cpfCnpj: input.cpfCnpj });
        if (existingUser) {
          throw new Error('User with this CPF/CNPJ already exists');
        }

        // Criptografar a senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Criar um novo usuário no banco de dados com a senha criptografada
        const newUser = await User.create({
          firstName: input.firstName,
          cpfCnpj: input.cpfCnpj,
          password: hashedPassword,
        });

        // Gerar um token de autenticação usando JWT
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET);

        // Retornar o token e os dados do usuário registrado
        return {
          token,
          user: newUser,
        };
      } catch (error) {
        throw new Error('Failed to register user');
      }
    },
  },
};

module.exports =  createUserResolver;

