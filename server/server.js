const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
// Import the ApolloServer class
const { ApolloServer } = require('apollo-server-express');

// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });  

    db.once('open', () => {
      app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);