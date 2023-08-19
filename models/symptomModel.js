const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const Symptoms = sqlize.define(
   'Symptoms',
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         allowNull: true,
         primaryKey: true,
      },
      patient_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      symptom_name: {
         type: DataTypes.STRING(100),
         allowNull: true,
      },
      severity: {
         type: DataTypes.STRING(100),
         allowNull: true,
      },
      date_reported: {
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
      tableName: 'symptoms',
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

module.exports = Symptoms;
