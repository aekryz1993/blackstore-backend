module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Payment', 'orderId', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Payment', 'peyMethod', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        
        queryInterface.removeColumn('Payment', 'status', { transaction: t }),
        queryInterface.removeColumn('Payment', 'amount', { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SequelizeMeta')
  }
};
