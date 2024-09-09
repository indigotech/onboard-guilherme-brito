import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { UserInput } from '../resolvers/create-user-resolver.js';
import { prisma, startDatabase } from '../database.js';

const createMockUser = async (): Promise<UserInput> => {
  const hashedPassword = await bcrypt.hash(faker.internet.password(), 1);
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: hashedPassword,
    birthDate: faker.date
      .birthdate()
      .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
  };
};

const generateUsers = async (count: number) => {
  const users = await Promise.all(
    faker.helpers.multiple(createMockUser, {
      count,
    }),
  );

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
};

await startDatabase();
generateUsers(50);
