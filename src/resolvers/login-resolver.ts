import { CustomHttpError } from '../errors.js';
import { prisma } from '../database.js';
import * as bcrypt from 'bcrypt';
import { EMAIL_NOT_FOUND_MESSAGE, INCORRECT_PASSWORD_MESSAGE } from '../utils/validators.js';

export interface LoginInput {
  email: string;
  password: string;
}

export const loginResolver = async (_, args: { data: LoginInput }) => {
  const { email, password } = args.data;

  const user = await findUserByEmail(email);
  await checkPassword(password, user.password);

  return { user, token: 'mockToken' };
};

const findUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
    return user;
  } catch {
    throw new CustomHttpError(400, EMAIL_NOT_FOUND_MESSAGE);
  }
};

const checkPassword = async (password: string, encryptedPassword: string) => {
  const isPasswordCorrect = await bcrypt.compare(password, encryptedPassword);
  if (!isPasswordCorrect) {
    throw new CustomHttpError(400, INCORRECT_PASSWORD_MESSAGE);
  }
};
