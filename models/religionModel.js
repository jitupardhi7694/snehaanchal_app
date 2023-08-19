const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const ReligionModel = sqlize.define(
   'ReligionModel',
   {
      id: {
         autoIncrement: true,
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
      },
      religion: {type: DataTypes.STRING(150), allowNull: false},
      isActive: {type: DataTypes.TINYINT, allowNull: false},
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      ip_addr: {
         type: DataTypes.STRING(45),
         allowNull: false,
      },
   },
   {
      tableName: 'religions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
   }
);

module.exports = ReligionModel;
