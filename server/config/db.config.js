import { Sequelize } from "sequelize";

const devEnv = {
    database: process.env.DB_SCHEMA  || 'auth_api_dev',
    username: process.env.DB_USER  || 'postgres',
    password: process.env.DB_PASSWORD || 123456,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const prodEnv = {
    database: 'system_administration_dev',
    username: 'root',
    password: 'password123',
    host: 'localhost',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const sequelize = new Sequelize(devEnv.database, devEnv.username, devEnv.password, {
    host: devEnv.host,
    port: devEnv.port,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: true,
        // rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0",
        rejectUnauthorized: false,
    },
    pool: config.pool
});
// const sequelize = new Sequelize(devEnv.host, {
//     dialect: 'postgres',
//     logging: false,
//     dialectOptions: {
//         ssl: {
//           require: true,
//           rejectUnauthorized: false
//         }
//     },
//     ssl: process.env.DB_SSL == "true",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });

export default sequelize