import { ContextPayload } from '../authentication.js';
import { prisma } from '../database.js';
import { CustomHttpError } from '../errors.js';
import { UNAUTHORIZED_MESSAGE, USER_ID_NOT_FOUND } from '../utils/validators.js';

export const userResolver = async (_, args: { id: number }, contextValue: ContextPayload) => {
  const { userInfo } = contextValue;
  if (!userInfo) {
    throw new CustomHttpError(401, UNAUTHORIZED_MESSAGE);
  }
  const { id } = args;

  return findUserById(id);
};

const findUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        addresses: true,
      },
    });
    return user;
  } catch {
    throw new CustomHttpError(404, USER_ID_NOT_FOUND);
  }
};
