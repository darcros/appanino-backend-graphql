import { Client } from 'pg';
import { createConnection, getConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// Creates the database if it doesn't already exist
const createDbIfNotExists = async () => {
  const ormOptions = (await getConnectionOptions()) as PostgresConnectionOptions;

  const client = new Client({
    host: ormOptions.host,
    port: ormOptions.port,
    password: ormOptions.password,
    user: ormOptions.username,
    database: 'postgres',
  });
  await client.connect(); // Connect to Postgres with native client

  const { rowCount: dbExists } = await client.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${ormOptions.database}'`,
  ); // Makes the query to check if the database already exist

  // If the database doesn't exist, then it's created
  if (!dbExists) {
    await client.query(`CREATE DATABASE "${ormOptions.database}"`);
  }
  await client.end(); // Native driver is closed
};

// Creates the database if it doesn't exist then connects TypeORM
export const initConnection = async () => {
  try {
    await createDbIfNotExists(); // TODO: add option to disable automatic DB creation
    await createConnection();
  } catch (error) {
    console.error(error);
    console.error('Connection to the database failed, exiting application');
    process.exit();
  }
};
