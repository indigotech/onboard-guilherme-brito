import { describe, it } from 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import { prisma } from '../src/database.js';
import {
  INVALID_LIMIT_MESSAGE,
  INVALID_PAGE_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  WITHOUT_USERS_MESSAGE,
} from '../src/utils/validators.js';
import { LOCAL_SERVER_URL } from './index.js';
import { generateToken } from '../src/resolvers/login-resolver.js';

const getUsersQueryRequest = (page: number, token?: string, limit?: number) => {
  const graphqlQuery = `#graphql
    query Users($page: Int!, $limit: Int) {
      users(page: $page, limit: $limit) {
        nextPage
        previousPage
        totalPages
        totalRecords
        users {
          birthDate
          email
          id
          name
          addresses {
            State
            city
            complement
            id
            street
            streetNumber
            postalCode
          }
        }
      }
    }`;

  const graphqlQueryRequestBody = {
    operationName: 'Users',
    query: graphqlQuery,
    variables: { page, limit },
  };

  return axios.post(LOCAL_SERVER_URL, graphqlQueryRequestBody, { headers: { Authorization: token } });
};

const generateUsers = (size: number) => {
  const mockCreateUsersData = [];
  const expectedUsers = [];
  for (let index = 0; index < size; index++) {
    mockCreateUsersData.push({
      id: index,
      name: `user${index}`,
      email: `teste${index}@taqtile.com.br`,
      password: 'banana123',
      birthDate: '25/04/2003',
      addresses: {
        create: [
          {
            id: index,
            city: 'São Paulo',
            postalCode: '05036-165',
            State: 'São Paulo',
            street: 'Rua teste 123',
            streetNumber: 98,
          },
        ],
      },
    });
    expectedUsers.push({
      id: index,
      name: `user${index}`,
      email: `teste${index}@taqtile.com.br`,
      birthDate: '25/04/2003',
      addresses: [
        {
          id: index,
          city: 'São Paulo',
          postalCode: '05036-165',
          State: 'São Paulo',
          street: 'Rua teste 123',
          streetNumber: 98,
          complement: null,
        },
      ],
    });
  }
  return { mockCreateUsersData, expectedUsers };
};

describe('#get users list query', () => {
  it('should not query users list without authorization token', async () => {
    const { data } = await getUsersQueryRequest(1);

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

  it('should query 10 first users when limit parameter is not passed and page is 1', async () => {
    const { mockCreateUsersData, expectedUsers } = generateUsers(10);
    await Promise.all(
      mockCreateUsersData.map(async (createUserData) => {
        await prisma.user.create({
          data: createUserData,
        });
      }),
    );

    const token = generateToken(1, false);
    const {
      data: {
        data: { users },
      },
    } = await getUsersQueryRequest(1, token);

    expect(users).to.be.deep.equal({
      users: expectedUsers,
      nextPage: null,
      previousPage: null,
      totalRecords: 10,
      totalPages: 1,
    });
  });

  it('should query 5 first users correctly when limit parameter is 5 and page is 1', async () => {
    const { mockCreateUsersData, expectedUsers } = generateUsers(10);
    await Promise.all(
      mockCreateUsersData.map(async (createUserData) => {
        await prisma.user.create({
          data: createUserData,
        });
      }),
    );

    const token = generateToken(1, false);
    const {
      data: {
        data: { users },
      },
    } = await getUsersQueryRequest(1, token, 5);

    expect(users).to.be.deep.equal({
      users: expectedUsers.slice(0, 5),
      nextPage: 2,
      previousPage: null,
      totalRecords: 10,
      totalPages: 2,
    });
  });

  it('should query 5 final users correctly when limit parameter is 5 and page is 2', async () => {
    const { mockCreateUsersData, expectedUsers } = generateUsers(10);
    await Promise.all(
      mockCreateUsersData.map(async (createUserData) => {
        await prisma.user.create({
          data: createUserData,
        });
      }),
    );

    const token = generateToken(1, false);
    const {
      data: {
        data: { users },
      },
    } = await getUsersQueryRequest(2, token, 5);

    expect(users).to.be.deep.equal({
      users: expectedUsers.slice(5, 10),
      nextPage: null,
      previousPage: 1,
      totalRecords: 10,
      totalPages: 2,
    });
  });

  it('should return error with invalid limit passed', async () => {
    const token = generateToken(1, false);
    const { data } = await getUsersQueryRequest(1, token, -1);

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

  it('should return error with invalid page passed (non-positive)', async () => {
    const token = generateToken(1, false);
    const { data } = await getUsersQueryRequest(0, token);

    expect(data).to.be.deep.equal({
      data: null,
      errors: [
        {
          code: 400,
          message: INVALID_PAGE_MESSAGE,
        },
      ],
    });
  });

  it('should return error with invalid page passed (page greater than current totalPages)', async () => {
    const { mockCreateUsersData } = generateUsers(10);
    await Promise.all(
      mockCreateUsersData.map(async (createUserData) => {
        await prisma.user.create({
          data: createUserData,
        });
      }),
    );

    const token = generateToken(1, false);
    const { data } = await getUsersQueryRequest(2, token);

    expect(data).to.be.deep.equal({
      data: null,
      errors: [
        {
          code: 400,
          message: INVALID_PAGE_MESSAGE,
        },
      ],
    });
  });

  it('should return error when there are no users stored in database', async () => {
    const token = generateToken(1, false);
    const { data } = await getUsersQueryRequest(1, token);
    expect(data).to.be.deep.equal({
      data: null,
      errors: [
        {
          code: 404,
          message: WITHOUT_USERS_MESSAGE,
        },
      ],
    });
  });
});
