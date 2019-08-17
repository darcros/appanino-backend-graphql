const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } = process.env;

module.exports = {
  type: 'postgres',

  // connection options
  host: DB_HOST || 'localhost',
  port: DB_PORT ? parseInt(DB_PORT) : 5432,
  username: DB_USERNAME || 'postgres',
  password: DB_PASSWORD || 'root',

  // db name
  database: 'appanino-db',

  // dev options
  synchronize: true,
  logging: true,

  // typeorm files
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],

  // CLI options
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
