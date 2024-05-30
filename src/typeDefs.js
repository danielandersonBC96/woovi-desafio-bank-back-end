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

  type Query {
    users: [User]
  }

  type Mutation {
    registerUser(firstName: String!, cpfCnpj: String!, email: String!, password: String!): User
    login(cpfCnpj: String!, password: String!): AuthPayload
    createUserWithAccount(input: CreateUserInput!): User
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
`;

module.exports = typeDefs;
