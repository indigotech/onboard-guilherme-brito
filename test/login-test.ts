import axios from 'axios';
import { LOCAL_SERVER_URL } from './index.js';
import { expect } from 'chai';
import { LoginInput } from '../src/resolvers/login-resolver.js';
import { prisma } from '../src/database.js';
import * as bcrypt from 'bcrypt';
import { EMAIL_NOT_FOUND_MESSAGE, INCORRECT_PASSWORD_MESSAGE } from '../src/utils/validators.js';

const loginMutationRequest = async (input: LoginInput) => {
  const graphqlMutation = `#graphql
    mutation Login($data: LoginInput!) {
      login(data: $data) {
        user {
          birthDate
          email
          id
          name
        }
        token
      }
    }`;

  const graphqlMutationRequestBody = {
    operationName: 'Login',
    query: graphqlMutation,
    variables: { data: input },
  };

  return axios.post(LOCAL_SERVER_URL, graphqlMutationRequestBody);
};

const HASH_ROUNDS = 1;

describe('#login mutation', () => {
  it('should return the propper informations from successfull login', async () => {
    const LOGIN_EMAIL = 'teste@taqtile.com.br';
    const LOGIN_PASSWORD = 'senha123';
    const ENCRYPTED_PASSWORD = bcrypt.hashSync(LOGIN_PASSWORD, HASH_ROUNDS);

    const { id, name, email, birthDate } = await prisma.user.create({
      data: { name: 'guilherme', email: LOGIN_EMAIL, password: ENCRYPTED_PASSWORD, birthDate: '22/02/2000' },
    });

    const {
      data: {
        data: { login },
      },
    } = await loginMutationRequest({
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
    });

    expect(login).to.be.deep.equal({
      user: {
        id,
        name,
        email,
        birthDate,
      },
      token: 'mockToken',
    });
  });

  it('should not return user information with unregistered email in login', async () => {
    const REGISTERED_LOGIN_EMAIL = 'teste@taqtile.com.br';
    const UNREGISTERED_LOGIN_EMAIL = 'banana@taqtile.com.br';
    const LOGIN_PASSWORD = 'senha123';
    const ENCRYPTED_PASSWORD = bcrypt.hashSync(LOGIN_PASSWORD, HASH_ROUNDS);

    await prisma.user.create({
      data: { name: 'guilherme', email: REGISTERED_LOGIN_EMAIL, password: ENCRYPTED_PASSWORD, birthDate: '22/02/2000' },
    });

    const {
      data: { errors },
    } = await loginMutationRequest({
      email: UNREGISTERED_LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
    });

    expect(errors).to.be.deep.equal([
      {
        code: 400,
        message: EMAIL_NOT_FOUND_MESSAGE,
      },
    ]);
  });

  it('should not return user information with incorrect password in login', async () => {
    const LOGIN_EMAIL = 'teste@taqtile.com.br';
    const CORRECT_LOGIN_PASSWORD = 'senha123';
    const INCORRECT_LOGIN_PASSWORD = 'banana123';
    const ENCRYPTED_PASSWORD = bcrypt.hashSync(CORRECT_LOGIN_PASSWORD, HASH_ROUNDS);

    await prisma.user.create({
      data: { name: 'guilherme', email: LOGIN_EMAIL, password: ENCRYPTED_PASSWORD, birthDate: '22/02/2000' },
    });

    const {
      data: { errors },
    } = await loginMutationRequest({
      email: LOGIN_EMAIL,
      password: INCORRECT_LOGIN_PASSWORD,
    });

    expect(errors).to.be.deep.equal([
      {
        code: 400,
        message: INCORRECT_PASSWORD_MESSAGE,
      },
    ]);
  });
});
