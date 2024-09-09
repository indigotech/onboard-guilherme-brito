import { GraphQLError } from 'graphql';
import { CustomHttpError } from './errors.js';
import { unwrapResolverError } from '@apollo/server/errors';

export const formatError = (formatedError: GraphQLError, wrappedError: unknown) => {
  const originalError = unwrapResolverError(wrappedError);

  if (originalError instanceof CustomHttpError) {
    return {
      code: originalError.code,
      message: originalError.message,
      additionalInfo: originalError.additionalInfo,
    };
  }

  return {
    code: 500,
    message: 'Ocorreu algum erro interno no servidor. Tente novamente em alguns instantes',
  };
};
