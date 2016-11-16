'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('station_prices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fuel_type_pk: {
        allowNull: false,
        references: {
          model: 'fuel_types',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      station_pk: {
        allowNull: false,
        references: {
          model: 'stations',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      sell_price: {
        type: Sequelize.FLOAT
      },
      buy_price: {
        type: Sequelize.FLOAT
      },
      sale_mode: {
        type: Sequelize.STRING
      },
      provider: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATEONLY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('station_prices');
  }
};