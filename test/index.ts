import { describe, it, before, after, afterEach } from 'mocha';
import { startServer, server } from '../src/server.js';
import { expect } from 'chai';
import axios from 'axios';
import { initializeDatabaseInstance, prisma } from '../src/database.js';
import { UserInput } from '../src/graphql.js';
import * as bcrypt from 'bcrypt';
import {
  EXISTING_EMAIL_MESSAGE,
  INVALID_BIRTH_DATE_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
} from '../src/utils/validators.js';

const LOCAL_SERVER_URL = `http://localhost:${process.env.PORT}`;

const graphqlMutation = `#graphql
mutation CreateUser($data: UserInput!) {
  createUser(data: $data) {
    birthDate
    email
    id
    name
  }
}`;

describe('Onboard Guilherme Brito', () => {
  describe('#core', () => {
    it('should print something in terminal', () => console.log('Core test working!'));
  });

  before(async () => {
    initializeDatabaseInstance();
    await Promise.all([prisma.$connect(), startServer()]);
  });

  after(() => {
    server.stop();
  });

  describe('#hello query', () => {
    it('should receive Hello World from hello query', async () => {
      const graphqlQuery = {
        operationName: 'Hello',
        query: 'query Hello { hello }',
        variables: {},
      };
      const res = await axios.post(LOCAL_SERVER_URL, graphqlQuery);
      expect(res.data.data.hello).to.be.equal('Hello World');
    });
  });

  describe('#create user mutation', () => {
    afterEach(async () => {
      await prisma.user.deleteMany();
    });

    it('should create a user with the correct informations', async () => {
      const userInput: UserInput = {
        birthDate: '25/04/2003',
        email: 'teste@taqtile.com.br',
        name: 'guilherme',
        password: 'senha123',
      };

      const graphqlMutationRequestBody = {
        operationName: 'CreateUser',
        query: graphqlMutation,
        variables: { data: userInput },
      };

      const {
        data: {
          data: { createUser },
        },
      } = await axios.post(LOCAL_SERVER_URL, graphqlMutationRequestBody);

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
      const userInput: UserInput = {
        birthDate: '25/04/2003',
        email: 'teste@taqtile.com.br',
        name: 'guilherme',
        password: '123',
      };

      const graphqlMutationRequestBody = {
        operationName: 'CreateUser',
        query: graphqlMutation,
        variables: { data: userInput },
      };

      const {
        data: { errors },
      } = await axios.post(LOCAL_SERVER_URL, graphqlMutationRequestBody);

      const dbUser = await prisma.user.findUnique({
        where: {
          email: 'teste@taqtile.com.br',
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(dbUser).to.be.null;

      expect(errors).to.be.deep.equal([
        {
          code: 400,
          message: INVALID_PASSWORD_MESSAGE,
        },
      ]);
    });

    it('should not create a user with invalid birthDate', async () => {
      const userInput: UserInput = {
        birthDate: '25-04-2003',
        email: 'teste@taqtile.com.br',
        name: 'guilherme',
        password: 'senha123',
      };

      const graphqlMutationRequestBody = {
        operationName: 'CreateUser',
        query: graphqlMutation,
        variables: { data: userInput },
      };

      const {
        data: { errors },
      } = await axios.post(LOCAL_SERVER_URL, graphqlMutationRequestBody);

      const dbUser = await prisma.user.findUnique({
        where: {
          email: 'teste@taqtile.com.br',
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(dbUser).to.be.null;

      expect(errors).to.be.deep.equal([
        {
          code: 400,
          message: INVALID_BIRTH_DATE_MESSAGE,
        },
      ]);
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

      const userInput: UserInput = {
        birthDate: '25/04/2003',
        email: 'teste@taqtile.com.br',
        name: 'guilherme',
        password: 'senha123',
      };

      const graphqlMutationRequestBody = {
        operationName: 'CreateUser',
        query: graphqlMutation,
        variables: { data: userInput },
      };

      const {
        data: { errors },
      } = await axios.post(LOCAL_SERVER_URL, graphqlMutationRequestBody);

      usersWithExistingEmailCount = await prisma.user.count({
        where: {
          email: 'teste@taqtile.com.br',
        },
      });

      expect(usersWithExistingEmailCount).to.be.equal(1);

      expect(errors).to.be.deep.equal([
        {
          code: 400,
          message: EXISTING_EMAIL_MESSAGE,
        },
      ]);
    });
  });
});
