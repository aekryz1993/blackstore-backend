import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Payment extends Model { }

Payment.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    peyMethod: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    orderId: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payment',
})

export default Payment
