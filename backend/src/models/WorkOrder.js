const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkOrder = sequelize.define('WorkOrder', {
  WorkOrderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Task: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'Task#'  // This maps to the actual column name in the database
  },
  Description: {
    type: DataTypes.STRING(2000),
    allowNull: true
  },
  ProjectID: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'WorkOrders',
  timestamps: false
});

module.exports = WorkOrder;
