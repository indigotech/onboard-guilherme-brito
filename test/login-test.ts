import axios from 'axios';
import { LOCAL_SERVER_URL } from './index.js';
import { expect } from 'chai';
import { LoginInput } from '../src/resolvers/login-resolver.js';

const loginMutationRequest = async (email: string, password: string) => {
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

  const loginInput: LoginInput = { email, password };

  const graphqlMutationRequestBody = {
    operationName: 'Login',
    query: graphqlMutation,
    variables: { data: loginInput },
  };

  return axios.post(LOCAL_SERVER_URL, graphqlMutationRequestBody);
};

describe('#login mutation', () => {
  it('should create a user with the correct informations', async () => {
    const {
      data: {
        data: { login },
      },
    } = await loginMutationRequest('teste@@taqtile.com.br', 'senha123');

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
