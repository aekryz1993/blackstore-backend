import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";
import ProductCode from "./ProductCode"
import Service from "./Service"

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
}, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'ProductCategory',
})


ProductCategory.hasMany(ProductCode)
ProductCategory.belongsTo(Service)

export default ProductCategory