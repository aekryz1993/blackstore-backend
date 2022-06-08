import { Sequelize } from "sequelize";

const devEnv = {
  database: process.env.DB_SCHEMA || "auth_api_dev",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  pool: {},
  dialectOptions: {},
};

const prodEnv = {
  database: process.env.DB_SCHEMA || "postgres",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "postgres",
  port: process.env.DB_PORT || 5432,
  dialectOptions: {
    ssl: process.env.DB_SSL == "true",
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const environment = process.env.NODE_ENV === "production" ? devEnv : devEnv;

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
