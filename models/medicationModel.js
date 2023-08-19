const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const Staff = sqlize.define(
   'medications',
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         allowNull: true,
         primaryKey: true,
      },
      medication_name: {type: DataTypes.STRING(100), allowNull: true},
      dosage: {type: DataTypes.STRING(100), allowNull: true},
      frequency: {type: DataTypes.STRING(100), allowNull: true},
      start_date: {type: DataTypes.DATE},
      end_date: {type: DataTypes.DATE},
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
         references: {
            model: 'users',
            key: 'id',
         },
      },
      ip_addr: {
         type: DataTypes.STRING(100),
         allowNull: true,
      },
      isActive: {type: DataTypes.TINYINT, allowNull: false},
   },
   {
      tableName: 'medications',
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
            name: 'user_id_idx',
            using: 'BTREE',
            fields: [{name: 'user_id'}],
         },
      ],
   }
);

module.exports = Staff;
