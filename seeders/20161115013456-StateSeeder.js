'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var stateNames = new Array(
      "Acre", "Alagoas", "Amapa", "Amazonas", "Bahia", "Ceara", "Distrito Federal",
      "Espirito Santo", "Goias", "Maranhao", "Mato Grosso", "Mato Grosso Do Sul",
      "Minas Gerais", "Para", "Paraiba", "Parana", "Pernambuco", "Piaui", "Rio De Janeiro",
      "Rio Grande Do Norte", "Rio Grande Do Sul", "Rondonia", "Roraima", "Santa Catarina",
      "Sao Paulo", "Sergipe", "Tocantins"
    );
    var stateObjects = new Array();

    for (var index = 0; index < stateNames.length; index++) {
      var elem = {
        name: stateNames[index],
        date_from: '2016-11-06',
        date_to: '2016-11-12',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      stateObjects.push(elem);
    }

    return queryInterface.bulkInsert('states', stateObjects, {});
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
