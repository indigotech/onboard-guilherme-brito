import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { isPasswordValid, isEmailUnique, isBirthDateValid } from './utils/validators.js';
import prisma from './prisma-client.js';
import * as bcrypt from 'bcrypt';

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

const hashRounds = 10;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    createUser: async (_, args: { data: UserInput }) => {
      const { name, email, password, birthDate } = args.data;

      isPasswordValid(password);
      await isEmailUnique(email);
      isBirthDateValid(birthDate);

      const encryptedPassword = await bcrypt.hash(password, hashRounds);

      return prisma.user.create({
        data: { name, email, password: encryptedPassword, birthDate },
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
