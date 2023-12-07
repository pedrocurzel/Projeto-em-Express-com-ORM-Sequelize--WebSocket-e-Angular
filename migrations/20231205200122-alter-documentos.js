'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Documentos", "valor", {
        type: Sequelize.DataTypes.TEXT("long")
    });
  }
};