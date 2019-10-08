import * as jwt from 'jsonwebtoken';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { JwtUserInfo } from '../modules/authentication/jwtUserInfo.interface';
import { Context } from './context.interface';

export const context = async ({ req }: ExpressContext): Promise<Context> => {
  try {
    const authHeader: string = req.headers.authorization || '';
    if (!authHeader) {
      return {};
    }

    const token = authHeader.replace(/^Bearer /, '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET');
    const data: JwtUserInfo = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;

    return {
      user: data,
    };
  } catch (e) {
    return {};
  }
};
