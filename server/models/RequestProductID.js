import { Sequelize, DataTypes, Model } from 'sequelize';

import sequelize from "../config/db.config";

class RequestProductID extends Model { }

RequestProductID.init({
   id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
   },
   userId: {
      type: DataTypes.STRING,
      allowNull: false
   },
   isTreated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
   },
}, {
   sequelize,
   modelName: 'RequestProductID',
   tableName: 'RequestProductID',
})

export default RequestProductID