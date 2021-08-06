import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Price extends Model {}

Price.init({
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
    modelName: 'Price',
    tableName: 'Price',
})

export default Price