const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const Prescriptions = sqlize.define(
   'Prescriptions',
   {
      id: {
         autoIncrement: true,
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
      },
      patient_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      staff_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },

      medication_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      start_date: {
         type: DataTypes.DATE,
         allowNull: true,
      },
      end_date: {
         type: DataTypes.DATE,
         allowNull: true,
      },

      user_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
         references: {
            model: 'users',
            key: 'id',
         },
      },
      ip_addr: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
   },
   {
      tableName: 'prescriptions',
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

module.exports = Prescriptions;
