const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const doctorPrescriptions = sqlize.define(
   'doctorPrescriptions',
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
      note_date: {
         type: DataTypes.DATE,
         allowNull: true,
      },

      symptom_name: {
         type: DataTypes.STRING(256),
         allowNull: true,
      },
      medication_name: {
         type: DataTypes.STRING(256),
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
      tableName: 'doctor_prescriptions',
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

module.exports = doctorPrescriptions;
