'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
    cityObjects = new Array();
    
    var cruzeiroDS = {
      state_pk: '1',
      name: 'Cruzeiro do Sul',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    cityObjects.push(cruzeiroDS);
    var rioBranco = {
      state_pk: '1',
      name: 'Rio Branco',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    cityObjects.push(rioBranco);

    return queryInterface.bulkInsert('cities', cityObjects, {});
    */
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
