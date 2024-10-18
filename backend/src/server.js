require('dotenv').config();
const express = require('express');
const cors = require('cors');
const timesheetRoutes = require('./routes/timesheetRoutes');
const vesselRoutes = require('./routes/vesselRoutes');
const clientRoutes = require('./routes/clientRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const projectRoutes = require('./routes/projectRoutes');
const disciplineRoutes = require('./routes/disciplineRoutes');
const staffRoutes = require('./routes/staffRoutes');


const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/timesheets', timesheetRoutes);
app.use('/api/staffs', staffRoutes);
app.use('/api/vessels', vesselRoutes);
app.use('/api/workorders', workOrderRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/disciplines', disciplineRoutes);


async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log('Database connection OK!');
  } catch (error) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  console.log(`Starting Sequelize + Express example on port ${PORT}...`);

  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}.`);
  });
}

init();
