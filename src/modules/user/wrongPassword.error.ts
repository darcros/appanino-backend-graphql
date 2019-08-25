import { ApolloError } from 'apollo-server-express';

export const WRONG_PASSWORD = new ApolloError('Wrong password', 'WRONG_PASSWORD');
