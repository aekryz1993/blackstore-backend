import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";
import ProductCategory from "./ProductCategory"

class ProductCode extends Model {}

ProductCode.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    isAvailable: {
        type: DataTypes.STRING,
        defaultValue: true,
    },
    priceCoin: {
        type: DataTypes.FLOAT,
    },
    pricePoint: {
        type: DataTypes.FLOAT,
    },
    picture: {
        type: DataTypes.STRING,
    },
    code: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'ProductCode',
    tableName: 'ProductCode',
})

ProductCode.belongsTo(ProductCategory);

export default ProductCode