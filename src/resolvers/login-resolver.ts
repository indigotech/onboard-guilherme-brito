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
  checkPassword(password, user.password);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    },
    token: 'mockToken',
  };
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

const checkPassword = (password: string, encryptedPassword: string) => {
  if (!isPasswordCorrect(password, encryptedPassword)) {
    throw new CustomHttpError(400, INCORRECT_PASSWORD_MESSAGE);
  }
};

const isPasswordCorrect = (password: string, encryptedPassword: string) =>
  bcrypt.compareSync(password, encryptedPassword);
