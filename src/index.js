const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('./typeDefs');
const loginResolvers = require('./resolvers/loginrResolvers.js'); // Corrigido o nome do arquivo e o estilo de camelCase
const createUserResolvers = require('./resolvers/ceateuserresolvers.js'); // Corrigido o nome do arquivo e o estilo de camelCase
const transferResolvers  = require( './resolvers/transferResolvers.js')
const mongoose = require('mongoose');
require('dotenv').config();

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const app = express();

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: [loginResolvers, createUserResolvers , transferResolvers],
    });

    app.use('/graphql', graphqlHTTP({
      schema,
      graphiql: true,
    }));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

