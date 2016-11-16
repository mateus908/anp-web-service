'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('statistics', {
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
      // Consumer Price
      cp_avgPrice: {
        type: Sequelize.FLOAT
      },
      cp_stdDeviation: {
        type: Sequelize.FLOAT
      },
      cp_minPrice: {
        type: Sequelize.FLOAT
      },
      cp_maxPrice: {
        type: Sequelize.FLOAT
      },
      cp_avgMargin: {
        type: Sequelize.FLOAT
      },
      // Distribution Price
      dp_avgPrice: {
        type: Sequelize.FLOAT
      },
      dp_stdDeviation: {
        type: Sequelize.FLOAT
      },
      dp_minPrice: {
        type: Sequelize.FLOAT
      },
      dp_maxPrice: {
        type: Sequelize.FLOAT
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
    return queryInterface.dropTable('statistics');
  }
};