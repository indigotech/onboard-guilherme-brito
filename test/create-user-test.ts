import { describe, it } from 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import { prisma } from '../src/database.js';
import { UserInput } from '../src/resolvers/create-user-resolver.js';
import * as bcrypt from 'bcrypt';
import {
  EXISTING_EMAIL_MESSAGE,
  INVALID_BIRTH_DATE_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from '../src/utils/validators.js';
import { LOCAL_SERVER_URL } from './index.js';
import { generateToken } from '../src/resolvers/login-resolver.js';

const createUserMutationRequest = (input: UserInput, token?: string) => {
  const graphqlMutation = `#graphql
    mutation CreateUser($data: UserInput!) {
      createUser(data: $data) {
        birthDate
        email
        id
        name
      }
    }`;

  const graphqlMutationRequestBody = {
    operationName: 'CreateUser',
    query: graphqlMutation,
    variables: { data: input },
  };

  return axios.post(LOCAL_SERVER_URL, graphqlMutationRequestBody, { headers: { Authorization: token } });
};

describe('#create user mutation', () => {
  it('should not create a user without authorization token', async () => {
    const { data } = await createUserMutationRequest({
      email: 'teste@taqtile.com.br',
      name: 'guilherme',
      password: 'senha123',
      birthDate: '25-04-2003',
    });

    const dbUser = await prisma.user.findUnique({
      where: {
        email: 'teste@taqtile.com.br',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(dbUser).to.be.null;

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

  it('should create a user with the correct informations', async () => {
    const token = generateToken(1, false);
    const {
      data: {
        data: { createUser },
      },
    } = await createUserMutationRequest(
      {
        email: 'teste@taqtile.com.br',
        name: 'guilherme',
        password: 'senha123',
        birthDate: '25/04/2003',
      },
      token,
    );

    const dbUser = await prisma.user.findUnique({
      where: {
        email: 'teste@taqtile.com.br',
      },
    });

    expect(dbUser.name).to.be.equal('guilherme');
    expect(dbUser.email).to.be.equal('teste@taqtile.com.br');
    expect(dbUser.birthDate).to.be.equal('25/04/2003');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(bcrypt.compareSync('senha123', dbUser.password)).to.be.true;

    expect(createUser).to.be.deep.equal({
      id: dbUser.id,
      name: 'guilherme',
      email: 'teste@taqtile.com.br',
      birthDate: '25/04/2003',
    });
  });

  it('should not create a user with invalid password', async () => {
    const token = generateToken(1, false);
    const { data } = await createUserMutationRequest(
      {
        email: 'teste@taqtile.com.br',
        name: 'guilherme',
        password: '123',
        birthDate: '25/04/2003',
      },
      token,
    );

    const dbUser = await prisma.user.findUnique({
      where: {
        email: 'teste@taqtile.com.br',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(dbUser).to.be.null;

    expect(data).to.be.deep.equal({
      data: null,
      errors: [
        {
          code: 400,
          message: INVALID_PASSWORD_MESSAGE,
        },
      ],
    });
  });

  it('should not create a user with invalid birthDate', async () => {
    const token = generateToken(1, false);
    const { data } = await createUserMutationRequest(
      {
        email: 'teste@taqtile.com.br',
        name: 'guilherme',
        password: 'senha123',
        birthDate: '25-04-2003',
      },
      token,
    );

    const dbUser = await prisma.user.findUnique({
      where: {
        email: 'teste@taqtile.com.br',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(dbUser).to.be.null;

    expect(data).to.be.deep.equal({
      data: null,
      errors: [
        {
          code: 400,
          message: INVALID_BIRTH_DATE_MESSAGE,
        },
      ],
    });
  });

  it('should not create a user with email that exists in database', async () => {
    const EXISTING_EMAIL = 'teste@taqtile.com.br';
    await prisma.user.create({
      data: { name: 'guilherme', email: EXISTING_EMAIL, password: 'senha123', birthDate: '22/02/2000' },
    });

    let usersWithExistingEmailCount = await prisma.user.count({
      where: {
        email: 'teste@taqtile.com.br',
      },
    });

    expect(usersWithExistingEmailCount).to.be.equal(1);

    const token = generateToken(1, false);
    const { data } = await createUserMutationRequest(
      {
        email: 'teste@taqtile.com.br',
        name: 'guilherme',
        password: 'senha123',
        birthDate: '25/04/2003',
      },
      token,
    );

    usersWithExistingEmailCount = await prisma.user.count({
      where: {
        email: 'teste@taqtile.com.br',
      },
    });

    expect(usersWithExistingEmailCount).to.be.equal(1);

    expect(data).to.be.deep.equal({
      data: null,
      errors: [
        {
          code: 400,
          message: EXISTING_EMAIL_MESSAGE,
        },
      ],
    });
  });
});
