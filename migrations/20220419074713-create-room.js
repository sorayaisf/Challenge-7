'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      player1Id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      player2Id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      player1Move: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['', '', ''],
      },
      player2Move: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['', '', ''],
      },
      matchInfo: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      winnerId: {
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rooms');
  }
};