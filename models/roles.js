const {sequelize, DataTypes} = require('sequelize');
const db = require('../helpers/init-mysql');

const UserRoles = db.define(
   'roles',
   {
      id: {
         autoIncrement: true,
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
      },
      role_name: {
         type: DataTypes.STRING(45),
         allowNull: false,
      },
      description: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      ip_addr: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      isActive: {type: DataTypes.TINYINT, allowNull: false},
   },

   {
      sequelize,
      tableName: 'user_roles',
      timestamps: true,
      indexes: [
         {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{name: 'id'}],
         },
      ],
   }
);

module.exports = UserRoles;
