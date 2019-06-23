import 'reflect-metadata';
import * as express from 'express';
import { initConnection } from './database/init.database';
import { ApolloServer } from 'apollo-server-express';
import { bootstrapSchema } from './util/schema.util';
import { Container } from 'typedi';
import { useContainer } from 'typeorm';
import { useContainer as typeUseContainer } from 'type-graphql';

typeUseContainer(Container);
useContainer(Container);

// This function it's used for startup the server
// It initialize the connection with the database
// Setup the express and apollo servers
export default async () => {
  await initConnection();

  const schema = await bootstrapSchema();
  const apollo = new ApolloServer({
    schema,
    playground: true,
  });
  const app = express();

  apollo.applyMiddleware({ app });

  app.listen(3000, () => {
    console.log('Server up and running');
  });
};
