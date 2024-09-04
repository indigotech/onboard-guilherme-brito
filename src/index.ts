import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';

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

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    createUser: async (_, args: { data: UserInput }) => {
      const userData = args.data;

      return await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          birthDate: userData.birthDate,
        },
      });
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
