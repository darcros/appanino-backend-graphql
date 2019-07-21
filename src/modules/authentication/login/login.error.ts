import { AuthenticationError } from 'apollo-server-core';

export const LOGIN_FAILED = new AuthenticationError('Login failed');
