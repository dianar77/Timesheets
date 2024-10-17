const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Timesheet = sequelize.define('Timesheet', {
  TimesheetID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  StaffID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  WorkOrderID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  Hours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  }
}, {
  tableName: 'Timesheets',
  timestamps: false
});

module.exports = Timesheet;
