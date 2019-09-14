import { ApolloError } from 'apollo-server-express';

export const NONEXISTENT_EMAIL = new ApolloError('Nonexistent email', 'NONEXISTENT_EMAIL');
