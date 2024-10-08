export const typeDefs = `#graphql
  type Query {
    hello: String
    user(id: Int!): User!
    users(page: Int!, limit: Int = 10): UsersPagination!
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
    addresses: [Address!]!
  }

  type LoggedInUser {
    user: User!
    token: String!
  }

  type UsersPagination {
    users: [User!]!
    totalRecords: Int!
    totalPages: Int!
    nextPage: Int
    previousPage: Int
  }

  type Address {
    id: Int!
    postalCode: String!
    street: String!
    streetNumber: Int!
    complement: String
    city: String!
    State: String!
  }
`;
