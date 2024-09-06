import { isBirthDateValid, isEmailUnique, isPasswordValid } from './utils/validators.js';
import * as bcrypt from 'bcrypt';
import { prisma } from './database.js';
import { GraphQLError } from 'graphql';
import { CustomHttpError } from './errors.js';
import { unwrapResolverError } from '@apollo/server/errors';

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

export interface UserInput {
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

export const formatError = (formatedError: GraphQLError, wrappedError: unknown) => {
  const originalError = unwrapResolverError(wrappedError);

  if (originalError instanceof CustomHttpError) {
    return {
      code: originalError.code,
      message: originalError.message,
      additionalInfo: originalError.additionalInfo,
    };
  }

  return {
    code: 500,
    message: 'Ocorreu algum erro interno no servidor. Tente novamente em alguns instantes',
  };
};
