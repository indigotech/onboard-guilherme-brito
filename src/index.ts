import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Query {
    hello: String
  }

  type Mutation {
    createUser(data: UserInput!): User!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type User {
    id: Int!
    name: String!
    email: String!
    birthDate: String!
  }
`;

interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    createUser: (_, args: { data: UserInput }) => {
      return {
        id: 1,
        ...args.data,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server started at: ${url}`);
