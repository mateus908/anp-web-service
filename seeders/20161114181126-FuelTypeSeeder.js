'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var fuelNames = new Array("Gasolina", "Etanol", "GNV", "Diesel", "Diesel S10", "GLP");
    var fuelObjects = new Array();

    for (var index = 0; index < fuelNames.length; index++) {
      var elem = {
        name: fuelNames[index],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      fuelObjects.push(elem);
    }

    return queryInterface.bulkInsert('fuel_types', fuelObjects, {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
