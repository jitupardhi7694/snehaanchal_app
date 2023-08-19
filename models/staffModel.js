const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const Staff = sqlize.define(
   'staff',
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         allowNull: false,
         primaryKey: true,
      },
      first_name: {type: DataTypes.STRING(100), allowNull: true},
      last_name: {type: DataTypes.STRING(100), allowNull: true},
      date_of_birth: {type: DataTypes.DATE},
      address: {type: DataTypes.STRING(250), allowNull: true},
      city: {type: DataTypes.STRING(100), allowNull: true},
      state: {type: DataTypes.STRING(100), allowNull: true},
      zip_code: {type: DataTypes.STRING(10), allowNull: true},
      phone_number: {type: DataTypes.STRING(20), allowNull: true},
      position: {type: DataTypes.STRING(100), allowNull: true},
      hire_date: {type: DataTypes.DATE},
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
      tableName: 'staff',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
   }
);

module.exports = Staff;
