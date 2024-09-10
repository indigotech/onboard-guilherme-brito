export const typeDefs = `#graphql
  type Query {
    hello: String
    user(id: Int!): User!
  }

  type Mutation {
    createUser(data: UserInput!): User!
    login(data: LoginInput!): LoggedInUser!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean
  }

  type User {
    id: Int!
    name: String!
    email: String!
    birthDate: String!
  }

  type LoggedInUser {
    user: User!
    token: String!
  }
`;
