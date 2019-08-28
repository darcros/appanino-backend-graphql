import { ApolloError } from 'apollo-server-express';

export const SAME_PASSWORD = new ApolloError('You are using the same password as before', 'SAME_PASSWORD');
