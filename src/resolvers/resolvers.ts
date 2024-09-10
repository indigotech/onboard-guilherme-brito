import { createUserResolver } from './create-user-resolver.js';
import { helloResolver } from './hello-resolver.js';
import { loginResolver } from './login-resolver.js';
import { userResolver } from './query-user-resolver.js';
import { usersResolver } from './query-users-resolver.js';

export const resolvers = {
  Query: {
    hello: helloResolver,
    user: userResolver,
    users: usersResolver,
  },
  Mutation: {
    createUser: createUserResolver,
    login: loginResolver,
  },
};
