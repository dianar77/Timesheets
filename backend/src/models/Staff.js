const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Staff = sequelize.define('Staff', {
  StaffID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PersonalID: {
    type: DataTypes.STRING,
    allowNull: true
  },
  DisciplineID: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Staff',
  timestamps: false
});

module.exports = Staff;
