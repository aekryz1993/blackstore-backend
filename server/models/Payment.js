import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Payment extends Model { }

Payment.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    orderId: {
        type: DataTypes.STRING,
        unique: true,
    },
    peyMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    checkoutUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payment',
})

export default Payment
