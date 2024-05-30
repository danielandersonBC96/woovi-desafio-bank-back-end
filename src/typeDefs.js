const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    cpfCnpj: String!
    email: String!
    password: String!
    accountId: ID
  }

  type Account {
    id: ID!
    userId: ID!
    accountNumber: String!
    balance: Float!
  }

  type Query {
    users: [User]
    accounts: [Account]
  }

  type Mutation {
    registerUser(firstName: String!, cpfCnpj: String!, email: String!, password: String!): User
    login(cpfCnpj: String!, password: String!): AuthPayload
    createUserWithAccount(input: CreateUserInput!): User
    transferMoney(senderId: ID!, receiverId: ID!, value: Float!): TransferResult!
  }

  input CreateUserInput {
    firstName: String!
    email: String!
    cpfCnpj: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type TransferResult {
    success: Boolean!
    message: String!
  }
`;

module.exports = typeDefs;
