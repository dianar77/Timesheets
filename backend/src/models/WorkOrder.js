const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkOrder = sequelize.define('WorkOrder', {
  WorkOrderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TaskNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ProjectID: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'WorkOrders',
  timestamps: false
});

module.exports = WorkOrder;
