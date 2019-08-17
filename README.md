# graphql-appanino

## Running with Docker

Just run `docker-compose up`, it will build the image and create the db.

Edit `docker-compose.yml` to change environment variables.
See [below](#Environment-variables) for details.

## Environment variables

### JWT_SECRET

The secret used to sign JWTs.
If not set the default secret is `SECRET`.

### DB_HOST

The host to use to connect to the database.
If not set the default host is `localhost`.

### DB_PORT

The port to use to connect to the database.
If not set the default port is `5432`.

### DB_USERNAME

The username to use to connect to the database.
If not set the default username is `postgres`.

### DB_PASSWORD

The password to use to connect to the database.
If not set the default password is `root`.
