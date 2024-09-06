import { prisma } from '../database.js';
import { CustomHttpError } from '../errors.js';
import { isPasswordValid, isBirthDateValid, EXISTING_EMAIL_MESSAGE } from '../utils/validators.js';
import * as bcrypt from 'bcrypt';

export interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

const HASH_ROUNDS = 10;

export const createUserResolver = async (_, args: { data: UserInput }) => {
  const { name, email, password, birthDate } = args.data;

  isPasswordValid(password);
  isBirthDateValid(birthDate);
  await isEmailUnique(email);

  const encryptedPassword = await bcrypt.hash(password, HASH_ROUNDS);

  return prisma.user.create({
    data: { name, email, password: encryptedPassword, birthDate },
  });
};

const isEmailUnique = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    throw new CustomHttpError(400, EXISTING_EMAIL_MESSAGE);
  }
};
