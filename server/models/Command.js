import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Command extends Model { }

Command.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isTreated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Command',
    tableName: 'Command',
})

export default Command