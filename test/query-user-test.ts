import { describe, it } from 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import { prisma } from '../src/database.js';
import { UNAUTHORIZED_MESSAGE, USER_ID_NOT_FOUND } from '../src/utils/validators.js';
import { LOCAL_SERVER_URL } from './index.js';
import { generateToken } from '../src/resolvers/login-resolver.js';

const getUserQueryRequest = (userId: number, token?: string) => {
  const graphqlQuery = `#graphql
    query User($userId: Int!) {
      user(id: $userId) {
        birthDate
        email
        id
        name
      }
    }`;

  const graphqlQueryRequestBody = {
    operationName: 'User',
    query: graphqlQuery,
    variables: { userId },
  };

  return axios.post(LOCAL_SERVER_URL, graphqlQueryRequestBody, { headers: { Authorization: token } });
};

describe('#get user query', () => {
  it('should not query a user without authorization token', async () => {
    const { data } = await getUserQueryRequest(12);

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

  it('should query a user with the correct information', async () => {
    const { id } = await prisma.user.create({
      data: { name: 'guilherme', email: 'teste@taqtile.com.br', password: 'senha123', birthDate: '22/02/2000' },
    });

    const token = generateToken(id, false);
    const {
      data: {
        data: { user },
      },
    } = await getUserQueryRequest(id, token);

    expect(user).to.be.deep.equal({
      id: id,
      name: 'guilherme',
      email: 'teste@taqtile.com.br',
      birthDate: '22/02/2000',
    });
  });

  it('should return error with invalid user id', async () => {
    const { id } = await prisma.user.create({
      data: { name: 'guilherme', email: 'teste@taqtile.com.br', password: 'senha123', birthDate: '22/02/2000' },
    });

    const token = generateToken(id, false);
    const { data } = await getUserQueryRequest(-1, token);

    expect(data).to.be.deep.equal({
      data: null,
      errors: [
        {
          code: 404,
          message: USER_ID_NOT_FOUND,
        },
      ],
    });
  });
});
