import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class PayMethod extends Model { }

PayMethod.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'PayMethod',
    tableName: 'PayMethod',
})

export default PayMethod