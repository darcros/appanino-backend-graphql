import 'reflect-metadata';
import * as express from 'express';
import * as jwt from 'express-jwt';
import { initConnection } from './database/init.database';
import { ApolloServer } from 'apollo-server-express';
import { bootstrapSchema } from './util/schema.util';
import { Container } from 'typedi';
import { useContainer } from 'typeorm';
import { useContainer as typeUseContainer } from 'type-graphql';
import { Context } from './util/context.interface';

typeUseContainer(Container);
useContainer(Container);

// This function it's used for startup the server
// It initialize the connection with the database
// Setup the express and apollo servers
export default async () => {
  await initConnection();
  const app = express();
  const path = '/graphql';

  app.use(
    path,
    jwt({
      // TODO: read secret from environment variable
      secret: 'SECRET',
      credentialsRequired: false,
    }),
  );

  const schema = await bootstrapSchema();
  const apollo = new ApolloServer({
    schema,
    playground: true,
    context: ({ req }): Context => ({
      user: req.user, // from `express-jwt`
    }),
  });
  apollo.applyMiddleware({ app, path });

  app.listen(3000, () => {
    console.log('Server up and running');
  });
};
