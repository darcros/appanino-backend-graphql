import { Client } from 'pg';
import { database } from '../../ormconfig.json';
import { createConnection } from 'typeorm';

// Check if the database is already existing by using the native Postgres Driver
// It takes the database name from the ormconfig.json file, if it not exist then it is created
// After the database creation/check, typeorm is connected to Postgres and the native connection it's closed
export const initConnection = async () => {
  try {
    const client = new Client({ password: 'root', user: 'postgres', database: 'postgres' });
    await client.connect(); // Trying to connect to Postgres

    const { rowCount: isExisting } = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${database}'`,
    ); // Makes the query to check is the database already exist

    // If the database not exist, then it's created
    if (!isExisting) {
      await client.query(`CREATE DATABASE "${database}"`);
    }

    await createConnection(); // Typeorm connection it's made
    await client.end(); // Native driver it's closed
  } catch (error) {
    // If an error occurs the application it's stopped
    console.log('Connection to the database failed, exiting application');
    process.exit();
  }
};
