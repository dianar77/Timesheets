const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  ProjectID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  Num: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  VesselID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Vessels',
      key: 'VesselID'
    }
  }
}, {
  tableName: 'Projects',
  timestamps: false,
});

// You can define associations here if needed
// For example:
// Project.associate = (models) => {
//   Project.belongsTo(models.Vessel, { foreignKey: 'VesselID' });
// };

module.exports = Project;
