import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Wallet extends Model {}

Wallet.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    dollar: {
        type: DataTypes.FLOAT,
        defaultValue: 0.00,
    },
    euro: {
        type: DataTypes.FLOAT,
        defaultValue: 0.00,
    },
    dinnar: {
        type: DataTypes.FLOAT,
        defaultValue: 0.00,
    },
}, {
    sequelize,
    modelName: 'Wallet',
    tableName: 'Wallet',
})

export default Wallet