const express = require('express');
const cors = require('cors');
const staffRoutes = require('./routes/staffRoutes');



const app = express();

app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use('/api/staff', staffRoutes);

module.exports = app;
