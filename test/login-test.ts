import axios from 'axios';
import { LOCAL_SERVER_URL } from './index.js';
import { expect } from 'chai';
import { LoginInput } from '../src/resolvers/login-resolver.js';

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

describe('#login mutation', () => {
  it('should return the propper informations from login', async () => {
    const {
      data: {
        data: { login },
      },
    } = await loginMutationRequest({
      email: 'teste@@taqtile.com.br',
      password: 'senha123',
    });

    expect(login).to.be.deep.equal({
      user: {
        id: 13,
        name: 'guilherme',
        email: 'teste@taqtile.com.br',
        birthDate: '25/04/2003',
      },
      token: 'mockToken',
    });
  });
});
