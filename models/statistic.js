'use strict';
module.exports = function(sequelize, DataTypes) {
  var Statistic = sequelize.define('Statistic', {
    // Consumer Price
    cp_avgPrice: DataTypes.FLOAT,
    cp_stdDeviation: DataTypes.FLOAT,
    cp_minPrice: DataTypes.FLOAT,
    cp_maxPrice: DataTypes.FLOAT,
    cp_avgMargin: DataTypes.FLOAT,

    // Distribution Price
    dp_avgPrice: DataTypes.FLOAT,
    dp_stdDeviation: DataTypes.FLOAT,
    dp_minPrice: DataTypes.FLOAT,
    dp_maxPrice: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        Statistic.belongsTo(models.City, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'city_pk',
            allowNull: false
          }
        });
        Statistic.belongsTo(models.FuelType, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'fuel_type_pk',
            allowNull: false
          }
        });
      }
    },
    tableName: 'statistics'
  });
  return Statistic;
};