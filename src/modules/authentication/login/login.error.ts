import { AuthenticationError } from 'apollo-server-express';

export const LOGIN_FAILED = new AuthenticationError('Login failed');
