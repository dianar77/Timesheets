const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vessel = sequelize.define('Vessel', {
  VesselID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  Num: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ClientID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Vessels',
  timestamps: false,
});

module.exports = Vessel;
