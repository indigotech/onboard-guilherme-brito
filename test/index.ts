import { before, after } from 'mocha';
import { startServer, server } from '../src/server.js';
import { initializeDatabaseInstance } from '../src/database.js';

export const LOCAL_SERVER_URL = `http://localhost:${process.env.PORT}`;

before(async () => {
  await Promise.all([initializeDatabaseInstance(), startServer()]);
});

import './hello-test.js';
import './create-user-test.js';
import './login-test.js';

after(() => {
  server.stop();
});
