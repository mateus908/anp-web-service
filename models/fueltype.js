'use strict';
module.exports = function(sequelize, DataTypes) {
  var FuelType = sequelize.define('FuelType', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        FuelType.hasMany(models.Statistic, {foreignKey: 'fuel_type_pk'});
        FuelType.hasMany(models.StationPrice, {foreignKey: 'fuel_type_pk'});
      }
    },
    tableName: 'fuel_types'
  });
  return FuelType;
};