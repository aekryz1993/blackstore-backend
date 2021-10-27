import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Image extends Model { }

Image.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
    },
    size: {
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'Image',
    tableName: 'Image',
})

export default Image