'use strict';
module.exports = function(sequelize, DataTypes) {
  var State = sequelize.define('State', {
    name: DataTypes.STRING,
    date_from: DataTypes.DATEONLY,
    date_to: DataTypes.DATEONLY
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