import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class Notification extends Model { }

Notification.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Notification',
    tableName: 'Notification',
})

export default Notification