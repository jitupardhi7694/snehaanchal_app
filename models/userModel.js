const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const User = sqlize.define(
   'User',
   {
      id: {
         autoIncrement: true,
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
      },
      name: {
         type: DataTypes.STRING(75),
         allowNull: false,
      },
      email: {
         type: DataTypes.STRING(75),
         allowNull: false,
      },
      password: {
         type: DataTypes.STRING(500),
         allowNull: false,
      },
      activation_key: {
         type: DataTypes.STRING(500),
         allowNull: true,
      },
      reset_key: {
         type: DataTypes.STRING(500),
         allowNull: true,
      },
      active: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      },
      role_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
         references: {
            model: 'roles',
            key: 'id',
         },
      },
      ip_addr: {
         type: DataTypes.STRING(45),
         allowNull: false,
      },
   },
   {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
         {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{name: 'id'}],
         },
         {
            name: 'roll_id_fk_idx',
            using: 'BTREE',
            fields: [{name: 'role_id'}],
         },
      ],
   }
);

module.exports = User;
