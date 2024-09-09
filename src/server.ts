import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { formatError } from './error-handler.js';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers/resolvers.js';
import { authenticationContext, ContextPayload } from './authentication.js';

export let server: ApolloServer<ContextPayload>;

export const startServer = async () => {
  server = new ApolloServer<ContextPayload>({
    typeDefs,
    resolvers,
    formatError,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT) },
    context: authenticationContext,
  });

  console.log(`Server started at: ${url} (Env: ${process.env.ENVIRONMENT})`);
};
