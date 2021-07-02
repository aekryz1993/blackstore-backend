import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Wallet extends Model {}

Wallet.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    creditPoint: {
        type: DataTypes.FLOAT,
        unique: true,
    },
    creditCoin: {
        type: DataTypes.FLOAT,
        unique: true,
    },
}, {
    sequelize,
    modelName: 'Wallet',
    tableName: 'Wallet',
})

export default Wallet