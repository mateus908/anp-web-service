'use strict';
module.exports = function(sequelize, DataTypes) {
  var Station = sequelize.define('Station', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    area: DataTypes.STRING,
    flag: DataTypes.STRING,
    sell_price: DataTypes.FLOAT,
    buy_price: DataTypes.FLOAT,
    sale_mode: DataTypes.STRING,
    provider: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Station.belongsTo(models.City, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'city_pk',
            allowNull: false
          }
        });
        Station.belongsTo(models.FuelType, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'fuel_type_pk',
            allowNull: false
          }
        });
      }
    },
    tableName: 'stations'
  });
  return Station;
};