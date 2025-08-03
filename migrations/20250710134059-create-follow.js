'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mini_social_follows', {
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
          model: 'mini_social_users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      followingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'mini_social_users',
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
    await queryInterface.addConstraint('mini_social_follows', {
      fields: ['followerId', 'followingId'],
      type: 'unique',
      name: 'unique_follow',
    })

    // Add indexes for both foreign keys
    await queryInterface.addIndex('mini_social_follows', ['followerId'])
    await queryInterface.addIndex('mini_social_follows', ['followingId'])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('mini_social_follows')
  },
}
