const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Staff = sequelize.define('Staff', {
  StaffID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  PersonalID: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  DisciplineID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Disciplines',
      key: 'DisciplineID'
    }
  }
}, {
  tableName: 'Staff',
  timestamps: false
});


module.exports = Staff;
