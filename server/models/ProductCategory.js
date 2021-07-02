import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class ProductCategory extends Model {}

ProductCategory.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    priceCoin: {
        type: DataTypes.FLOAT,
    },
    pricePoint: {
        type: DataTypes.FLOAT,
    },
}, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'ProductCategory',
})

export default ProductCategory