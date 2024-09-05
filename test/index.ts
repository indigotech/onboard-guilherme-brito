import { describe, it, before, after } from 'mocha';
import { startServer, server } from '../src/server.js';
import { expect } from 'chai';
import axios from 'axios';
import { startDatabase, prisma } from '../src/database.js';

const LOCAL_SERVER_URL = 'http://localhost:4001';

describe('Onboard Guilherme Brito', () => {
  describe('#core', () => {
    it('should print something in terminal', () => console.log('Core test working!'));
  });

  describe('#e2e apis', () => {
    before(async () => {
      startDatabase();
      await Promise.all([prisma.$connect(), startServer()]);
    });

    after(() => {
      server.stop();
    });

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
});
