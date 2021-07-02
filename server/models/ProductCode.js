import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class ProductCode extends Model {}

ProductCode.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Serial: {
        type: DataTypes.STRING,
    },
    Date: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'ProductCode',
    tableName: 'ProductCode',
})

export default ProductCode