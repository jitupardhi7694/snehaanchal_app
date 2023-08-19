const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const patientDocs = sqlize.define(
   'patient_docs',
   {
      id: {
         autoIncrement: true,
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
      },
      patientID: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      docName: {
         type: DataTypes.STRING(150),
         allowNull: true,
      },
      docImage: {
         type: DataTypes.STRING(2000),
         allowNull: false,
         comment: 'kept long for path name',
      },
      doc_data: {
         type: DataTypes.BLOB('long'),
         allowNull: false,
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
      tableName: 'patient_docs',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      indexes: [
         {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{name: 'id'}],
         },
         {
            name: 'user_id_fk_idx',
            using: 'BTREE',
            fields: [{name: 'user_id'}],
         },
      ],
   }
);

module.exports = patientDocs;
