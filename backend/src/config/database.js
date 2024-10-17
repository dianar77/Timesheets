const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Timesheets', 'sa', 'sapassword', {
  host: 'gooding20',
  port: 1433,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      useUTC: false,
      dateFirst: 1,
      encrypt: false
    },
  },
  logging: console.log // This will log all SQL queries
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connection has been established successfully.'))
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    console.error('Error details:', err.original);
  });

module.exports = sequelize;
