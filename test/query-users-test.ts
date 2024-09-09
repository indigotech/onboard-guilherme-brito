import { describe, it } from 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import { prisma } from '../src/database.js';
import { INVALID_LIMIT_MESSAGE, UNAUTHORIZED_MESSAGE } from '../src/utils/validators.js';
import { LOCAL_SERVER_URL } from './index.js';
import { generateToken } from '../src/resolvers/login-resolver.js';

const getUsersQueryRequest = (token?: string, limit?: number) => {
  const graphqlQuery = `#graphql
    query Users($limit: Int) {
      users(limit: $limit) {
        birthDate
        email
        id
        name
      }
    }`;

  const graphqlQueryRequestBody = {
    operationName: 'Users',
    query: graphqlQuery,
    variables: { limit },
  };

  return axios.post(LOCAL_SERVER_URL, graphqlQueryRequestBody, { headers: { Authorization: token } });
};

const generateUsers = (size: number) => {
  const users = [];
  for (let index = 0; index < size; index++) {
    users.push({
      id: index,
      name: `user${index}`,
      email: `teste${index}@taqtile.com.br`,
      password: 'banana123',
      birthDate: '25/04/2003',
    });
  }
  return users;
};

describe('#get users list query', () => {
  it('should not query users list without authorization token', async () => {
    const { data } = await getUsersQueryRequest();

    expect(data).to.be.deep.equal({
      data: null,
      errors: [
        {
          code: 401,
          message: UNAUTHORIZED_MESSAGE,
        },
      ],
    });
  });

  it('should query 10 users when limit parameter is not passed', async () => {
    const mockUsers = generateUsers(10);
    await prisma.user.createMany({
      data: mockUsers,
    });

    const token = generateToken(1, false);
    const {
      data: {
        data: { users },
      },
    } = await getUsersQueryRequest(token);

    mockUsers.forEach((user) => delete user.password);
    expect(users).to.be.deep.equal(mockUsers);
  });

  it('should query users list correctly when limit parameter is passed', async () => {
    const mockUsers = generateUsers(10);
    await prisma.user.createMany({
      data: mockUsers,
    });

    const token = generateToken(1, false);
    const {
      data: {
        data: { users },
      },
    } = await getUsersQueryRequest(token, 5);

    const expectedResponse = mockUsers.slice(0, 5);
    expectedResponse.forEach((user) => delete user.password);
    expect(users).to.be.deep.equal(expectedResponse);
  });

  it('should return error with invalid limit passed', async () => {
    const token = generateToken(1, false);
    const { data } = await getUsersQueryRequest(token, -1);

    expect(data).to.be.deep.equal({
      data: null,
      errors: [
        {
          code: 400,
          message: INVALID_LIMIT_MESSAGE,
        },
      ],
    });
  });
});
