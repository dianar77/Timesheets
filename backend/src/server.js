require('dotenv').config();
const express = require('express');
const cors = require('cors');
const timesheetRoutes = require('./routes/timesheets');
const staffRoutes = require('./routes/staffRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/timesheets', timesheetRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/workorders', workOrderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
