import 'reflect-metadata';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { initConnection } from './database/init.database';
import { ApolloServer } from 'apollo-server-express';
import { bootstrapSchema } from './util/schema.util';
import { Container } from 'typedi';
import { useContainer } from 'typeorm';
import { useContainer as typeUseContainer, ArgumentValidationError } from 'type-graphql';
import { GraphQLError } from 'graphql';
import { Context } from './util/context.interface';
import { JwtUserInfo } from './modules/authentication/jwtUserInfo.interface';

typeUseContainer(Container);
useContainer(Container);

// This function it's used for startup the server
// It initialize the connection with the database
// Setup the express and apollo servers
export default async () => {
  await initConnection();
  const app = express();
  const path = '/graphql';

  const schema = await bootstrapSchema();
  const apollo = new ApolloServer({
    schema,
    playground: true,
    context: async ({ req }): Promise<Context> => {
      try {
        const authHeader: string = req.headers.authorization || '';
        if (!authHeader) {
          return {};
        }

        const token = authHeader.replace(/^Bearer /, '');

        const decoded = await jwt.verify(token, process.env.JWT_SECRET || 'SECRET');
        const data: JwtUserInfo = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;

        return {
          user: data,
        };
      } catch (e) {
        return {};
      }
    },
    formatError: err => {
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
    },
  });
  apollo.applyMiddleware({ app, path });

  app.listen(4000, () => {
    console.log('Server up and running');
  });
};
