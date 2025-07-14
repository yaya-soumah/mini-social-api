'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('follows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      followerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      followingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })

    // Add composite unique constraint to prevent duplicate follows
    await queryInterface.addConstraint('follows', {
      fields: ['followerId', 'followingId'],
      type: 'unique',
      name: 'unique_follow',
    })

    // Add indexes for both foreign keys
    await queryInterface.addIndex('follows', ['followerId'])
    await queryInterface.addIndex('follows', ['followingId'])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('follows')
  },
}
