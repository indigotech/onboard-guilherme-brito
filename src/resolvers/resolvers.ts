import { createUserResolver } from './create-user-resolver.js';
import { helloResolver } from './hello-resolver.js';
import { loginResolver } from './login-resolver.js';
import { userResolver } from './query-user-resolver.js';

export const resolvers = {
  Query: {
    hello: helloResolver,
    user: userResolver,
  },
  Mutation: {
    createUser: createUserResolver,
    login: loginResolver,
  },
};
