import { ContextPayload } from '../authentication.js';
import { prisma } from '../database.js';
import { CustomHttpError } from '../errors.js';
import {
  INVALID_LIMIT_MESSAGE,
  INVALID_PAGE_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  WITHOUT_USERS_MESSAGE,
} from '../utils/validators.js';

export const usersResolver = async (_, args: { page: number; limit: number }, contextValue: ContextPayload) => {
  const { userInfo } = contextValue;
  if (!userInfo) {
    throw new CustomHttpError(401, UNAUTHORIZED_MESSAGE);
  }
  const { page, limit } = args;

  if (page < 1) {
    throw new CustomHttpError(400, INVALID_PAGE_MESSAGE);
  }

  if (limit < 1) {
    throw new CustomHttpError(400, INVALID_LIMIT_MESSAGE);
  }

  const offset = (page - 1) * limit;
  const totalRecords = await prisma.user.count();

  if (totalRecords === 0) {
    throw new CustomHttpError(404, WITHOUT_USERS_MESSAGE);
  }

  if (offset >= totalRecords) {
    throw new CustomHttpError(400, INVALID_PAGE_MESSAGE);
  }

  const nextPage = offset + limit >= totalRecords ? null : page + 1;
  const previousPage = offset - limit < 0 ? null : page - 1;
  const totalPages = Math.ceil(totalRecords / limit);

  const users = await findUsers(offset, limit);
  return {
    users,
    totalRecords,
    totalPages,
    nextPage,
    previousPage,
  };
};

const findUsers = async (offset: number, limit: number) =>
  prisma.user.findMany({
    skip: offset,
    take: limit,
    orderBy: { name: 'asc' },
  });
