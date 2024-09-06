import { prisma } from '../database.js';
import { isPasswordValid, isEmailUnique, isBirthDateValid } from '../utils/validators.js';
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
  await isEmailUnique(email);
  isBirthDateValid(birthDate);

  const encryptedPassword = await bcrypt.hash(password, HASH_ROUNDS);

  return prisma.user.create({
    data: { name, email, password: encryptedPassword, birthDate },
  });
};
