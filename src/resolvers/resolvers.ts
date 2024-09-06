import { createUserResolver } from './create-user-resolver.js';
import { helloResolver } from './hello-resolver.js';
import { loginResolver } from './login-resolver.js';

export const resolvers = {
  Query: {
    hello: helloResolver,
  },
  Mutation: {
    createUser: createUserResolver,
    login: loginResolver,
  },
};
