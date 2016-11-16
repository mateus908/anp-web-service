'use strict';
module.exports = function(sequelize, DataTypes) {
  var Station = sequelize.define('Station', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    area: DataTypes.STRING,
    flag: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Station.hasMany(models.StationPrice, {foreignKey: 'station_pk'});
        Station.belongsTo(models.City, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'city_pk',
            allowNull: false
          }
        });
      }
    },
    tableName: 'stations'
  });
  return Station;
};