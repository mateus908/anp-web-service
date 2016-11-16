'use strict';
module.exports = function(sequelize, DataTypes) {
  var StationPrice = sequelize.define('StationPrice', {
    sell_price: DataTypes.FLOAT,
    buy_price: DataTypes.FLOAT,
    sale_mode: DataTypes.STRING,
    provider: DataTypes.STRING,
    date: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models) {
        StationPrice.belongsTo(models.Station, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'station_pk',
            allowNull: false
          }
        });
        StationPrice.belongsTo(models.FuelType, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'fuel_type_pk',
            allowNull: false
          }
        });
      }
    },
    tableName: 'station_prices'
  });
  return StationPrice;
};