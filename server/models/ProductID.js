import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class ProductID extends Model {}

ProductID.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false
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
}, {
    sequelize,
    modelName: 'ProductID',
    tableName: 'ProductID',
})

export default ProductID