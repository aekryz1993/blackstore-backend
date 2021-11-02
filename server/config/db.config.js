import { Sequelize } from "sequelize";
// import path from "path";
// import fs from "fs";

// import {env} from '../app';

// const CURRENT_WORKING_DIR = process.cwd();

const devEnv = {
  database: process.env.DB_SCHEMA || "auth_api_dev",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || 123456,
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  pool: {},
  dialectOptions: {},
};

const prodEnv = {
  database: process.env.DB_SCHEMA || "auth_api_dev",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  dialectOptions : {
    // ssl: {
    //   ca: fs.readFileSync(path.resolve(CURRENT_WORKING_DIR, 'postgress_ssl.crt')),
    // },
    ssl: process.env.DB_SSL == "true",
    // rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0",
    // rejectUnauthorized: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const environment = process.env.NODE_ENV === 'development' ? prodEnv : devEnv;

const sequelize = new Sequelize(
  environment.database,
  environment.username,
  environment.password,
  {
    host: environment.host,
    port: environment.port,
    dialect: "postgres",
    logging: false,
    dialectOptions: environment.dialectOptions,
    pool: devEnv.pool,
  }
);

export default sequelize;
