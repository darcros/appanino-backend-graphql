import { GraphQLError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';

export const formatError = (err: GraphQLError) => {
  const rewriteCode = (err: GraphQLError, code: string) => ({
    ...err,
    extensions: {
      ...err.extensions,
      code,
    },
  });

  if (err.originalError instanceof ArgumentValidationError) {
    return rewriteCode(err, 'VALIDATION_FAILED');
  }

  return err;
};
