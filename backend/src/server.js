require('dotenv').config();
const express = require('express');
const cors = require('cors');
const timesheetRoutes = require('./routes/timesheetRoutes');
const staffRoutes = require('./routes/staffRoutes');
const vesselRoutes = require('./routes/vesselRoutes');
const clientRoutes = require('./routes/clientRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/timesheets', timesheetRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/vessels', vesselRoutes);
app.use('/api/workorders', workOrderRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
