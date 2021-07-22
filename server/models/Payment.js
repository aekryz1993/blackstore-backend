import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Payment extends Model { }

Payment.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    codeID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    confirmed: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payment',
})

export default Payment