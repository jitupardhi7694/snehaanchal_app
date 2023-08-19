const {DataTypes} = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const Patient = sqlize.define(
   'Patient',
   {
      id: {
         autoIncrement: true,
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
      },
      name: {
         type: DataTypes.STRING(75),
         allowNull: false,
      },
      age: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      gender: {
         type: DataTypes.STRING(1),
         allowNull: false,
      },
      reg_id: {
         type: DataTypes.STRING(25),
         allowNull: false,
      },
      reg_date: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      aadhar: {
         type: DataTypes.STRING(12),
         allowNull: true,
      },
      pic_filename: {
         type: DataTypes.STRING(2000),
         allowNull: false,
         comment: 'kept long for path name',
      },
      image_data: {
         type: DataTypes.BLOB('long'),
         allowNull: false,
      },
      ref_by: {
         type: DataTypes.STRING(65),
         allowNull: true,
      },
      local_address: {
         type: DataTypes.STRING(500),
         allowNull: true,
      },
      local_city: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      local_landmark: {
         type: DataTypes.STRING(65),
         allowNull: true,
      },
      local_phone1: {
         type: DataTypes.STRING(11),
         allowNull: true,
      },
      local_phone2: {
         type: DataTypes.STRING(11),
         allowNull: true,
      },
      permanent_address: {
         type: DataTypes.STRING(400),
         allowNull: true,
      },
      permanent_city: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      permanent_landmark: {
         type: DataTypes.STRING(65),
         allowNull: true,
      },
      permanent_phone1: {
         type: DataTypes.STRING(11),
         allowNull: true,
      },
      permanent_phone2: {
         type: DataTypes.STRING(11),
         allowNull: true,
      },
      fathers_name: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      mothers_name: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      spouse_name: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      religion: {
         type: DataTypes.STRING(75),
         allowNull: true,
      },
      language: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },

      patient_type_id: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      occupation: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      family_occupation: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      family_earning: {
         type: DataTypes.STRING(20),
         allowNull: true,
      },
      remarks: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      buddy_name: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      buddy_relation: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      buddy_address: {
         type: DataTypes.STRING(500),
         allowNull: true,
      },
      buddy_city: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      buddy_phone: {
         type: DataTypes.STRING(11),
         allowNull: true,
      },
      buddy1_name: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      buddy1_relation: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      buddy1_address: {
         type: DataTypes.STRING(500),
         allowNull: true,
      },
      buddy1_city: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      buddy1_phone: {
         type: DataTypes.STRING(11),
         allowNull: true,
      },
      admit_name: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      admit_relation: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      admit_address: {
         type: DataTypes.STRING(500),
         allowNull: true,
      },

      admit_age: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      admit_gender: {
         type: DataTypes.STRING(1),
         allowNull: true,
      },
      isActive: {type: DataTypes.TINYINT, allowNull: true},
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
      tableName: 'patients',
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

module.exports = Patient;
