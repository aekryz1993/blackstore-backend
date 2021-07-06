import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Service extends Model {}

Service.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM,
        values: ['id', 'code']
    },
}, {
    sequelize,
    modelName: 'Service',
    tableName: 'Service',
})

export default Service