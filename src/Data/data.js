// src/data.js
let users = [
  { id: '1', firstName: 'John', cpfCnpj: '123.456.789-00', email: 'john@example.com', password: 'password123' },
  { id: '2', firstName: 'Jane', cpfCnpj: '987.654.321-00', email: 'jane@example.com', password: 'password456' },
];

const addUser = (firstName, cpfCnpj, email, password) => {
  const newUser = { id: `${users.length + 1}`, firstName, cpfCnpj, email, password };
  users.push(newUser);
  return newUser;
};

const findUserByCpfCnpj = (cpfCnpj) => {
  return users.find(user => user.cpfCnpj === cpfCnpj);
};

export { users, addUser, findUserByCpfCnpj };
