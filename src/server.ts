import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { formatError } from './error-handler.js';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers/resolvers.js';

export let server: ApolloServer;

export const startServer = async () => {
  server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT) },
  });

  console.log(`Server started at: ${url} (Env: ${process.env.ENVIRONMENT})`);
};
