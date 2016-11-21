'use strict';
module.exports = function(sequelize, DataTypes) {
  var State = sequelize.define('State', {
    name: DataTypes.STRING,
    date_from: DataTypes.STRING,
    date_to: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        State.hasMany(models.City, {foreignKey: 'state_pk'});
      }
    },
    tableName: 'states'
  });
  return State;
};