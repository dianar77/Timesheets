const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const workOrderController = require('./controllers/workOrderController');
const projectController = require('./controllers/projectController');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Add these routes to your existing Express app

app.get('/api/workorders', workOrderController.getAllWorkOrders);
app.post('/api/workorders', workOrderController.createWorkOrder);
app.put('/api/workorders/:id', workOrderController.updateWorkOrder);
app.delete('/api/workorders/:id', workOrderController.deleteWorkOrder);

app.get('/api/projects', projectController.getAllProjects);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
