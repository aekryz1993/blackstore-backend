import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Permission extends Model { }

Permission.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    addProduct: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    updateProductPrice: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    updateProduct: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    addUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    viewUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    updateUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    updateCredit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    addPayMethod: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    viewcmnd: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    confirmPayment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Permission',
    tableName: 'Permission',
})

export default Permission