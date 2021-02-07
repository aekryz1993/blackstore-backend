import { Sequelize } from "sequelize";
// function connectTODatabase(config = {}, db= {}) {

//     const sequelize = new Sequelize(devEnv.database, devEnv.username, devEnv.password, {
//         host: devEnv.host,
//         dialect: 'postgres',
//         logging: false,
//     });



// }

const devEnv = {
    database: process.env.DB,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.DBHOST,
    // pool: {
    //     max: 5,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    // }
};

const prodEnv = {
    database: 'system_administration_dev',
    username: 'root',
    password: 'password123',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const sequelize = new Sequelize(devEnv.database, devEnv.username, devEnv.password, {
    host: devEnv.host,
    dialect: 'postgres',
    logging: false,
});

export default sequelize