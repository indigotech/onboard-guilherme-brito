import { isBirthDateValid, isEmailUnique, isPasswordValid } from './utils/validators.js';
import * as bcrypt from 'bcrypt';
import prisma from './prisma-client.js';

export const typeDefs = `#graphql
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

const HASH_ROUNDS = 10;

export const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    createUser: async (_, args: { data: UserInput }) => {
      const { name, email, password, birthDate } = args.data;

      isPasswordValid(password);
      await isEmailUnique(email);
      isBirthDateValid(birthDate);

      const encryptedPassword = await bcrypt.hash(password, HASH_ROUNDS);

      return prisma.user.create({
        data: { name, email, password: encryptedPassword, birthDate },
      });
    },
  },
};
