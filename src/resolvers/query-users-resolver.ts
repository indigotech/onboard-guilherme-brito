import { ContextPayload } from '../authentication.js';
import { prisma } from '../database.js';
import { CustomHttpError } from '../errors.js';
import { INVALID_LIMIT_MESSAGE, UNAUTHORIZED_MESSAGE } from '../utils/validators.js';

export const usersResolver = async (_, args: { limit: number }, contextValue: ContextPayload) => {
  const { userInfo } = contextValue;
  if (!userInfo) {
    throw new CustomHttpError(401, UNAUTHORIZED_MESSAGE);
  }
  const { limit } = args;

  if (limit < 1) {
    throw new CustomHttpError(400, INVALID_LIMIT_MESSAGE);
  }

  return findUsers(limit);
};

const findUsers = async (limit: number) =>
  prisma.user.findMany({
    take: limit,
    orderBy: { name: 'asc' },
  });
