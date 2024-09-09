import { CustomHttpError } from '../errors.js';
import { prisma } from '../database.js';
import * as bcrypt from 'bcrypt';
import { EMAIL_NOT_FOUND_MESSAGE, INCORRECT_PASSWORD_MESSAGE } from '../utils/validators.js';
import jwt from 'jsonwebtoken';
import { JWT_TOKEN_EXPIRATION } from '../utils/consts.js';

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtTokenPayload {
  id: number;
  iat: number;
  exp: number;
}

export const loginResolver = async (_, args: { data: LoginInput }) => {
  const { email, password } = args.data;

  const user = await findUserByEmail(email);
  await checkPassword(password, user.password);

  const token = generateToken(user.id);

  return { user, token };
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

const generateToken = (id: number) => jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: JWT_TOKEN_EXPIRATION });
