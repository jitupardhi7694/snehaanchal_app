const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const LanguageModel = sqlize.define(
   'LanguageModel',
   {
      id: {
         autoIncrement: true,
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
      },
      language: {type: DataTypes.STRING(150), allowNull: false},
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
      tableName: 'languages',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
   }
);

module.exports = LanguageModel;
