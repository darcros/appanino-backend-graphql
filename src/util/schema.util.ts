// Use this file for create schema generation functions

import { buildSchema } from 'type-graphql';
import { join } from 'path';
import { customAuthChecker } from '../modules/authentication/authChecker';

// This function generate a GraphQL by importing all the resolvers in the application
export async function bootstrapSchema() {
  const schema = await buildSchema({
    resolvers: [join(__dirname, '../modules/**/*.resolver.ts')], // Load all the resolver in the modules folder
    authChecker: customAuthChecker,
    validate: true,
  });

  return schema; // Created schema
}
