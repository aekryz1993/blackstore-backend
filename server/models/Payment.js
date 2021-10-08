import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Payment extends Model { }

Payment.init({
    id: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payment',
})

export default Payment