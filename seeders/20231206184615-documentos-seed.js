'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Documentos', [
        {
            nome: "JavaScript",
            valor: "",
            createdAt: new Date(),
            updatedAt: new Date()
        },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Documentos', null, {});
  }
};
