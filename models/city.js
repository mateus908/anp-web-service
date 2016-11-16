'use strict';
module.exports = function(sequelize, DataTypes) {
  var City = sequelize.define('City', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        City.hasMany(models.Statistic, {foreignKey: 'city_pk'});
        City.hasMany(models.Station, {foreignKey: 'city_pk'});
        City.belongsTo(models.State, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'state_pk',
            allowNull: false
          }
        });
      }
    },
    tableName: 'cities'
  });
  return City;
};