'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('stations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      city_pk: {
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id'
        },
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
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      area: {
        type: Sequelize.STRING
      },
      flag: {
        type: Sequelize.STRING
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
        type: Sequelize.STRING
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
    return queryInterface.dropTable('stations');
  }
};