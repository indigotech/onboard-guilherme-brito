import { describe, it, before, after, afterEach } from 'mocha';
import { startServer, server } from '../src/server.js';
import { expect } from 'chai';
import axios from 'axios';
import { initializeDatabaseInstance, prisma } from '../src/database.js';
import { UserInput } from '../src/graphql.js';
import * as bcrypt from 'bcrypt';

const LOCAL_SERVER_URL = `http://localhost:${process.env.PORT}`;

describe('Onboard Guilherme Brito', () => {
  describe('#core', () => {
    it('should print something in terminal', () => console.log('Core test working!'));
  });

  describe('e2e apis', () => {
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
          variables: { data: userInput },
        };

        const {
          data: {
            data: {
              createUser: { name, email, birthDate },
            },
          },
        } = await axios.post(LOCAL_SERVER_URL, graphqlMutationRequestBody);

        expect(name).to.be.equal('guilherme');
        expect(email).to.be.equal('teste@taqtile.com.br');
        expect(birthDate).to.be.equal('25/04/2003');

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
      });
    });
  });
});
