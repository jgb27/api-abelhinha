
const CREATE_TABLE_PRODUCT = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE IF NOT EXISTS products (
    _id UUID UNIQUE DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    tags TEXT[],
    url VARCHAR(255) UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    PRIMARY KEY (_id)
  );
`

const CREATE_TABLE_USER = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE IF NOT EXISTS users (
    _id UUID DEFAULT uuid_generate_v4() UNIQUE,
    name VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    fone VARCHAR(255) UNIQUE,
    role VARCHAR(255) DEFAULT 'cliente',
    PRIMARY KEY (_id)
  );
`

export {
  CREATE_TABLE_PRODUCT,
  CREATE_TABLE_USER,
}