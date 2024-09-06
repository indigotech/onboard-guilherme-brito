import { before, after } from 'mocha';
import { startServer, server } from '../src/server.js';
import { initializeDatabaseInstance, prisma } from '../src/database.js';

export const LOCAL_SERVER_URL = `http://localhost:${process.env.PORT}`;

before(async () => {
  initializeDatabaseInstance();
  await Promise.all([prisma.$connect(), startServer()]);
});

import './hello-test.js';
import './create-user-test.js';
import './login-test.js';

after(() => {
  server.stop();
});
