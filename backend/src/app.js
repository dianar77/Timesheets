const express = require('express');
const cors = require('cors');
const staffRoutes = require('./routes/staffRoutes');
const timesheetRoutes = require('./routes/timesheetRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/staff', staffRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/workorders', workOrderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
