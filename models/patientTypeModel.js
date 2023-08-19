const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const PatientType = sqlize.define(
   'patient_type',
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         allowNull: false,
         primaryKey: true,
      },
      type_code: {type: DataTypes.STRING(150), allowNull: false},
      type_name: {type: DataTypes.STRING(150), allowNull: true},
      isActive: {type: DataTypes.TINYINT, allowNull: false},
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      ip_addr: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
   },
   {
      tableName: 'patient_type',
      timestamps: true,
   }
);

module.exports = PatientType;
