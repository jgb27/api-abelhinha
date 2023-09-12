const CREATE_TABLE_PRODUCT = `
  CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    tags TEXT[],
    url VARCHAR(255),
    description TEXT,
    imageUrl VARCHAR(255),
    user_id INT REFERENCES users(id)
  );
`

const CREATE_TABLE_USER = `
  CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  );
`
export {
  CREATE_TABLE_PRODUCT,
  CREATE_TABLE_USER,
}
