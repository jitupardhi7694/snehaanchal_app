const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const Visits = sqlize.define(
   'visits',
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
      visit_date: {
         type: DataTypes.STRING(500),
         allowNull: true,
      },
      notes: {
         type: DataTypes.STRING(500),
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
      tableName: 'visits',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
         // eslint-disable-next-line no-unused-vars
         beforeCreate: (instance, options) => {
            if (!instance.visit_date) {
               instance.visit_date = instance.getDataValue('created_at');
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

module.exports = Visits;
