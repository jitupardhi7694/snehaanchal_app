const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const UserProfile = sqlize.define(
   'UserProfile',
   {
      user_id: {type: DataTypes.INTEGER, allowNull: false},
      address: {type: DataTypes.STRING(150), allowNull: false},
      city: {type: DataTypes.STRING(45), allowNull: false},
      state: {type: DataTypes.STRING(45), allowNull: false},
      pincode: {type: DataTypes.STRING(6), allowNull: false},
      phone: {type: DataTypes.STRING(10), allowNull: false},
   },
   {
      tableName: 'user_profile',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
   }
);

module.exports = UserProfile;
