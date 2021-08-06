import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Permission extends Model { }

Permission.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    addUsers: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    viewUsers: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    payments: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    payMethod: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    commands: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    products: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    treatRequest: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Permission',
    tableName: 'Permission',
})

export default Permission