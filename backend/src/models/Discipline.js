const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Discipline = sequelize.define('Discipline', {
  DisciplineID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Rate: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true
  }
}, {
  tableName: 'Disciplines',
  timestamps: false,
});

module.exports = Discipline;
