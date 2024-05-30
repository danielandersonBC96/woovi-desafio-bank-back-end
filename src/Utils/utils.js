// src/utils.js
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // Em uma aplicação real, usamos uma chave segura e mantenha-a em variáveis de ambiente

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};

const verifyPassword = (user, password) => {
  // Em uma aplicação real, use hashing para senhas (ex: bcrypt)
  return user.password === password;
};

module.exports = { generateToken, verifyPassword };


