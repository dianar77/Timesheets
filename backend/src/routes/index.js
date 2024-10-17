const express = require('express');
const router = express.Router();

const timesheetRoutes = require('./timesheetRoutes');
const staffRoutes = require('./staffRoutes');
const vesselRoutes = require('./vesselRoutes');
const workOrderRoutes = require('./workOrderRoutes');
const clientRoutes = require('./clientRoutes');


router.use('/timesheets', timesheetRoutes);
router.use('/staff', staffRoutes);
router.use('/vessels', vesselRoutes);
router.use('/workorders', workOrderRoutes);
router.use('/clients', clientRoutes);

module.exports = router;
