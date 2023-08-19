const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const Nurse = sqlize.define(
   'Nurse',
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
      nurse_date: {
         type: DataTypes.DATE,
         allowNull: true,
      },
      nurse_notes: {
         type: DataTypes.STRING(500),
         allowNull: true,
      },
      //   draft: {
      //      type: DataTypes.BOOLEAN,
      //      allowNull: true,
      //   },
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
      tableName: 'nurse',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
         beforeCreate: (instance) => {
            if (!instance.nurse_date) {
               'instance'.nurse_date = instance.getDataValue('created_at');
            }
         },
      },
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

module.exports = Nurse;
