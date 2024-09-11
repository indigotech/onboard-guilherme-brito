import { before, after, afterEach } from 'mocha';
import { startServer, server } from '../src/server.js';
import { startDatabase, prisma } from '../src/database.js';

export const LOCAL_SERVER_URL = `http://localhost:${process.env.PORT}`;

before(async () => {
  await Promise.all([startDatabase(), startServer()]);
});

import './hello-test.js';
import './create-user-test.js';
import './login-test.js';
import './query-user-test.js';
import './query-users-test.js';

after(async () => {
  await Promise.all([prisma.$disconnect(), server.stop()]);
});

afterEach(async () => {
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
});
